// ── AUTH & LEADERBOARD ────────────────────────────────────────────
// This file handles everything related to user authentication
// (login, register, logout) and the leaderboard display.
// It is separate from script.js to keep responsibilities clear —
// script.js handles tabs, pitch diagram and quiz,
// auth.js handles user accounts and leaderboard.


// ── ON PAGE LOAD ─────────────────────────────────────────────────
// This runs automatically as soon as the page finishes loading.
// It checks if the user is already logged in from a previous session
// and loads the leaderboard data.
window.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
  loadLeaderboard();
});


// ── CHECK LOGIN STATUS ────────────────────────────────────────────
// Sends a request to Flask asking "is anyone logged in right now?"
// Flask checks the session cookie and replies with yes or no.
// If yes, we update the nav bar to show the username instead of Login.
// This is how the site remembers you between page refreshes.
function checkLoginStatus() {
  fetch('/current_user_info')       // calls the Flask route /current_user_info
    .then(r => r.json())            // converts the response to JSON
    .then(data => {
      if (data.logged_in) {         // if Flask says someone is logged in
        showLoggedIn(data.username); // update the nav bar with their username
      }
    });
}


// ── SHOW LOGGED IN STATE ──────────────────────────────────────────
// Updates the nav bar when a user is logged in.
// Hides the Login button and shows the username + Logout button instead.
// username — the logged in user's username from Flask
function showLoggedIn(username) {
  document.getElementById('loginBtn').style.display = 'none';        // hide Login button
  document.getElementById('logoutBtn').style.display = 'inline-block'; // show Logout button
  document.getElementById('navUsername').textContent = username;      // show their username
}


// ── SHOW LOGGED OUT STATE ─────────────────────────────────────────
// Updates the nav bar when a user logs out.
// Shows the Login button again and hides the username + Logout button.
function showLoggedOut() {
  document.getElementById('loginBtn').style.display = 'inline-block'; // show Login button
  document.getElementById('logoutBtn').style.display = 'none';        // hide Logout button
  document.getElementById('navUsername').textContent = '';             // clear username text
}


// ── CLOSE MODAL ───────────────────────────────────────────────────
function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('registerMsg').style.display = 'none';
  sessionStorage.setItem('activeTab', tab.dataset.tabValue);
}


// ── SWITCH TO REGISTER VIEW ───────────────────────────────────────
// The modal has two views — login and register.
// This switches from the login view to the register view
// when the user clicks "Create an Account".
function showRegister() {
  document.getElementById('loginView').style.display = 'none';    // hide login form
  document.getElementById('registerView').style.display = 'block'; // show register form
}


// ── SWITCH TO LOGIN VIEW ──────────────────────────────────────────
// Switches back from the register view to the login view
// when the user clicks "Back to Login".
function showLogin() {
  document.getElementById('registerView').style.display = 'none'; // hide register form
  document.getElementById('loginView').style.display = 'block';   // show login form
}


// ── SUBMIT LOGIN ──────────────────────────────────────────────────
// Runs when the user clicks the Login button.
// Reads the username and password they typed, sends them to Flask,
// and handles the response.
// Flask checks the password against the bcrypt hash in the database.
// If correct, Flask creates a session cookie and returns success.
function submitLogin() {
  // Read values from the input fields
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  // Send the username and password to the Flask /login route
  // using a POST request with JSON data
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }) // converts to JSON string
  })
  .then(r => r.json()) // parse Flask's response as JSON
  .then(data => {
    if (data.success) {
      // Login was successful
      showLoggedIn(data.username); // update nav bar
      closeModal();                // close the modal
      loadLeaderboard();           // refresh leaderboard
    } else {
      // Login failed — show the error message from Flask
      const err = document.getElementById('loginError');
      err.textContent = data.message; // e.g. "Incorrect username or password"
      err.style.display = 'block';    // make it visible
    }
  });
}


// ── SUBMIT REGISTER ───────────────────────────────────────────────
// Runs when the user clicks Create Account.
// Reads the username, email and password they typed,
// sends them to Flask, and handles the response.
// Flask hashes the password with bcrypt before storing it —
// the plain text password is never saved to the database.
function submitRegister() {
  // Read values from the register form fields
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  // Send the registration data to the Flask /register route
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  .then(r => r.json()) // parse Flask's response
  .then(data => {
    const msg = document.getElementById('registerMsg');
    msg.style.display = 'block'; // show the message div

    if (data.success) {
      // Registration successful
      msg.style.color = '#4CAF50'; // green text
      msg.textContent = data.message + ' Redirecting to login...';
      setTimeout(() => showLogin(), 1500); // switch to login after 1.5 seconds
    } else {
      // Registration failed — e.g. username already taken
      msg.style.color = '#f44336'; // red text
      msg.textContent = data.message;
    }
  });
}


// ── SUBMIT LOGOUT ─────────────────────────────────────────────────
// Runs when the user clicks Logout.
// Sends a request to Flask to destroy the session cookie,
// which logs the user out server-side.
// Then updates the nav bar to show the Login button again.
function submitLogout() {
  fetch('/logout')       // calls the Flask /logout route
    .then(r => r.json()) // parse response
    .then(() => {
      showLoggedOut();   // update nav bar to logged out state
      loadLeaderboard(); // refresh leaderboard
    });
}


// ── LOAD LEADERBOARD ─────────────────────────────────────────────
// Fetches the top 10 scores from Flask and builds an HTML table
// to display them in the leaderboard tab.
// Flask queries the database for each user's best score
// and returns them in order from highest to lowest.
function loadLeaderboard() {
  fetch('/leaderboard')  // calls the Flask /leaderboard route
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById('leaderboard-container');
      if (!container) return; // exit if leaderboard tab doesn't exist yet

      if (data.leaderboard.length === 0) {
        // No scores yet — show a friendly message
        container.innerHTML = '<p style="text-align:center; color:#aaa;">No scores yet — be the first!</p>';
        return;
      }

      // Build the leaderboard table HTML
      let html = '<table style="width:100%; border-collapse:collapse; font-family:\'Source Sans Pro\',sans-serif;">';
      
      // Table header row
      html += '<tr style="background:#EB178F; color:white;"><th style="padding:10px;">Rank</th><th style="padding:10px;">Player</th><th style="padding:10px;">Best Score</th></tr>';

      // Loop through each entry and add a row
      data.leaderboard.forEach((row, i) => {
        // Show medals for top 3, numbers for the rest
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<tr style="border-bottom:1px solid #f0b8d8; text-align:center;">
          <td style="padding:10px;">${medal}</td>
          <td style="padding:10px;">${row.username.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</td>
          <td style="padding:10px;">${row.best_score} / 10</td>
        </tr>`;
      });

      html += '</table>';
      container.innerHTML = html; // insert the table into the page
    });
}