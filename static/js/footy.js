// ── FOOTY AI CHATBOT ─────────────────────────────────────────────
// This file handles all chatbot logic for the Footy AI assistant.
// It is intentionally separated from script.js (which handles tabs,
// the pitch diagram and quiz) to keep responsibilities clear.
// In the final Flask implementation, the fetch call moves to a
// server-side /chat route so the API key never reaches the browser.



// ── 1. CONVERSATION HISTORY ───────────────────────────────────────
// We store the full conversation so Footy remembers earlier messages.
// Each message is an object with a role ("user" or "assistant")
// and the content (what was said).
// Example: { role: "user", content: "who is messi?" }

let footyHistory = [];


// ── 2. SEND MESSAGE ───────────────────────────────────────────────
// This runs when the user clicks Send or presses Enter.
// It:
//   a) reads what the user typed
//   b) displays it in the chat window
//   c) adds it to the history
//   d) shows the typing animation
//   e) sends everything to the proxy server
//   f) displays the reply when it comes back

async function sendFootyMessage() {
  const input = document.getElementById('footy-input');
  const message = input.value.trim();

  // Don't do anything if the input is empty
  if (!message) return;

  // Show the user's message in the chat window
  appendFootyMessage(message, 'user');

  // Clear the input box
  input.value = '';

  // Add to history so the AI remembers the conversation
  footyHistory.push({ role: 'user', content: message });

  // Show the typing animation while we wait for a reply
  const typingId = appendFootyTyping();

  try {
    // Send the conversation to Flask
    // Flask forwards it to OpenRouter and sends the reply back
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
      body: JSON.stringify({
        messages: footyHistory
      })
    });

    const data = await response.json();

    // Remove the typing animation
    removeFootyTyping(typingId);

    // Display the reply
    if (data.content && data.content[0] && data.content[0].text) {
      const reply = data.content[0].text;
      // Add Footy's reply to history too
      footyHistory.push({ role: 'assistant', content: reply });
      appendFootyMessage(reply, 'bot');
    } else {
      appendFootyMessage('Sorry, I could not get a response just now. Please try again!', 'bot');
    }

  } catch (err) {
    // If something goes wrong, show the actual error so we can debug it
    removeFootyTyping(typingId);
    appendFootyMessage('Error: ' + err.message, 'bot');
    console.error('Footy error:', err);
  }
}


// ── 3. DISPLAY A MESSAGE ──────────────────────────────────────────
// This adds a message bubble to the chat window.
// sender is either 'user' (pink, right side) or 'bot' (light pink, left side)

function appendFootyMessage(text, sender) {
  const win = document.getElementById('footy-chat-window');
  const div = document.createElement('div');
  div.className = 'footy-msg footy-msg--' + sender;

  if (sender === 'bot') {
    div.innerHTML = '<span class="footy-avatar">⚽</span>'
      + '<div class="footy-bubble footy-bubble--bot">' + escapeHtml(text) + '</div>';
  } else {
    div.innerHTML = '<div class="footy-bubble footy-bubble--user">' + escapeHtml(text) + '</div>';
  }

  win.appendChild(div);

  // Scroll to the bottom so the latest message is always visible
  win.scrollTop = win.scrollHeight;
}


// ── 4. TYPING ANIMATION ───────────────────────────────────────────
// Shows three bouncing dots while waiting for Footy's reply.
// Returns an id so we can remove it once the reply arrives.

function appendFootyTyping() {
  const win = document.getElementById('footy-chat-window');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'footy-msg footy-msg--bot';
  div.id = id;
  div.innerHTML = '<span class="footy-avatar">⚽</span>'
    + '<div class="footy-bubble footy-bubble--bot footy-typing">'
    + '<span></span><span></span><span></span></div>';
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
  return id;
}

function removeFootyTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}


// ── 5. SECURITY: ESCAPE HTML ──────────────────────────────────────
// This prevents XSS (cross-site scripting) attacks.
// If the AI or a user types something like <script>alert('hack')</script>
// this function converts the < and > into harmless text so it
// displays as text rather than running as code.
// This maps directly to your OWASP Top 10 security requirements.

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}