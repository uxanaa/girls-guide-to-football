 // Restore saved tab immediately
(function() {
  var savedTab = localStorage.getItem('activeTab');
  if (savedTab && savedTab !== '#tab_1') {
    var allTabs = document.querySelectorAll('[data-tab-info]');
    allTabs.forEach(function(t) { t.classList.remove('active'); });
    var target = document.querySelector(savedTab);
    if (target) target.classList.add('active');
  }
})();


// function to get each tab details
    const tabs = document.querySelectorAll('[data-tab-value]')
    const tabInfos = document.querySelectorAll('[data-tab-info]')

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document
      .querySelector(tab.dataset.tabValue);
    tabInfos.forEach(tabInfo => {
      tabInfo.classList.remove('active')
    })
    target.classList.add('active');
    localStorage.setItem('activeTab', tab.dataset.tabValue);
  })
})

                  // Example player positions (you can adjust coordinates as per your image)
                  const players = [
                    { name: "Player 1", position: "GoalKeeper", x: 574, y: 160, info: "Role: Protect the goal and prevents the opposing team from scoring." },
                    { name: "Player 2", position: "Right Back", x: 435, y: 30, info: "" },
                    { name: "Player 3", position: "Left Back", x: 435, y: 265, info: "" },
                    { name: "Player 4", position: "Centre Back(cb)", x: 467, y: 204, info: "Role: Mark opposition attackers and move the ball away from danger." },
                    { name: "Player 5", position: "Centre Back(cb)", x: 467, y: 102, info: "Role: Mark opposition attackers and move the ball away from danger." },
                    { name: "Player 6", position: "Defensive Midfielder", x: 380, y: 114, info: "Role: Stop the opposition from scoring and help the team build play from the back." },
                    { name: "Player 7", position: "Left Wing", x: 231, y: 243, info: "" },
                    { name: "Player 8", position: "Central Midfielder", x: 359, y: 192, info: "" },
                    { name: "Player 9", position: "Striker", x: 175, y: 147, info: "" },
                    { name: "Player 10", position: "Attacking Midfielder", x: 279, y: 149, info: "" },
                    { name: "Player 11", position: "Right Wing", x: 230, y: 46, info: "" },
                ];
         
                const field = document.getElementById('field');
const infoPopup = document.getElementById('infoPopup');
const image = field.querySelector('img'); // Select the image within the field

// Event listener to detect clicks on the football field
field.addEventListener('click', function (e) {
    const rect = image.getBoundingClientRect(); // Get the image's position and size
    const x = e.clientX - rect.left; // Adjust x to the image's boundaries
    const y = e.clientY - rect.top;  // Adjust y to the image's boundaries

    // Loop through players to check if the click was near a player
    players.forEach(player => {
        const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
        if (distance < 10) { // If click is within 10px of the player's position
            showPlayerInfo(player);
        }
    });
});

// Function to display player information in the popup
function showPlayerInfo(player) {
    infoPopup.innerHTML = `<strong>${player.name}</strong><br>Position: ${player.position}<br>${player.info}`;
    infoPopup.style.left = `${player.x + 10}px`;
    infoPopup.style.top = `${player.y + 10}px`;
    infoPopup.style.display = 'block';
}

// Close the popup if clicked outside
window.addEventListener('click', function (e) {
    if (!field.contains(e.target) && !infoPopup.contains(e.target)) {
        infoPopup.style.display = 'none';
    }

   });

// Quiz data (same as before)
const quizData = [
  {
    question: "What is the primary role of a goalkeeper in football?",
    options: ["To score goals", "To defend the goal", "To pass the ball", "To tackle players"],
    correct: 1
  },
  {
    question: "In which country is the English Premier League played?",
    options: ["England", "Spain", "Italy", "Germany"],
    correct: 0
  },
  {
    question: "How many players are on the field for each team in a standard football match (including the goalkeeper)?",
    options: ["9", "10", "11", "12"],
    correct: 2
  },
  {
    question: "What is a yellow card in football?",
    options: ["A warning for unsporting behavior", "A red card", "A penalty awarded to the other team", "A free kick"],
    correct: 0
  },
  {
    question: "How many points are awarded for a win in a standard football league match?",
    options: ["1 point", "5 points", "2 points", "3 points"],
    correct: 3
  },
  {
    question: "Which of these is a type of pass in football?",
    options: ["Dribble", "Cross", "Serve", "Swing"],
    correct: 1
  },
  {
    question: "What is a free kick in football?",
    options: ["A penalty taken from the halfway line", "A goal kick", "A kick awarded after a foul, taken from the spot of the foul", "A kick taken from behind the goal line"],
    correct: 2
  },
  {
    question: "What is the role of a central midfielder in football?",
    options: ["To block the goalkeeper", "To create attacking opportunities and control the game from the center of the field", "To defend only", "To score goals"],
    correct: 1
  },
  {
    question: "What happens if a football match is tied after the regular 90 minutes in certain competitions?",
    options: ["It ends in a draw", "Extra time is played", "A penalty shootout is held", "The match is replayed"],
    correct: 1
  },
  {
    question: "Which of these competitions is played between the top European club teams?",
    options: ["La Liga", "FA Cup", "UEFA Champions League", "Copa del Rey"],
    correct: 2
  },
  {
    question: "What is the offside rule in football?",
    options: ["A player can’t be closer to the opponent’s goal line than the last defender.", "A player can’t be behind the midfield line.", "A player can’t be closer to the opponent’s goal line than the second-last defender when the ball is passed to them.", "A player must always stay behind the ball."],
    correct: 2
  },
  {
    question: "What is a 'hat-trick' in football?",
    options: ["Scoring two goals in one match", "Assisting three goals in one match", "Saving three penalties in one match", "Scoring three goals in one match"],
    correct: 3
  }
];

// Function to shuffle the array and pick random questions
function getRandomQuestions(numQuestions = 10) {
  const shuffledData = [...quizData].sort(() => Math.random() - 0.5);
  return shuffledData.slice(0, numQuestions);
}

// DOM Elements
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const remainingQuestionsContainer = document.getElementById("remaining-questions");

let currentQuiz = 0; // Track the current question
let selectedAnswer = null; // Track the selected answer
let correctAnswers = 0; // Track the score
let wrongAnswers = []; // Array to store wrong answers

// Get 10 random questions
let quizQuestions = getRandomQuestions();

// Load Quiz
function loadQuiz() {
  const currentQuestion = quizQuestions[currentQuiz];
  quizContainer.innerHTML = `
    <h2>${currentQuestion.question}</h2>
    ${currentQuestion.options
      .map(
        (option, index) => `
      <button class="answer" onclick="selectAnswer(${index})">${option}</button>
    `
      )
      .join("")}
  `;
 
  // Display number of questions left
  remainingQuestionsContainer.innerHTML = `Questions Left: ${quizQuestions.length - currentQuiz}`;

  resultContainer.innerHTML = ""; // Clear result text
}

// Handle Answer Selection
function selectAnswer(index) {
  selectedAnswer = index; // Track the selected answer

  const answerButtons = document.querySelectorAll(".answer");
  answerButtons.forEach((btn, i) => {
    btn.disabled = true; // Disable all buttons after an answer is selected
    if (i === index && index !== quizQuestions[currentQuiz].correct) {
      // Wrong answer selected
      btn.classList.add("wrong");
      // Store the wrong answer with the correct answer for later display
      wrongAnswers.push({
        question: quizQuestions[currentQuiz].question,
        selected: quizQuestions[currentQuiz].options[index],
        correct: quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]
      });
    }
    if (i === quizQuestions[currentQuiz].correct) {
      // Highlight the correct answer
      btn.classList.add("correct");
    }
  });

  // Show result
  if (index === quizQuestions[currentQuiz].correct) {
    resultContainer.textContent = "Correct!";
    resultContainer.style.color = "#4CAF50"; // Green text for correct
    correctAnswers++; // Increment correct answers count
  } else {
    resultContainer.textContent = "Wrong!";
    resultContainer.style.color = "#f44336"; // Red text for wrong
  }

  // Prepare for the next question or end quiz
  currentQuiz++;
  if (currentQuiz < quizQuestions.length) {
    setTimeout(() => {
      selectedAnswer = null; // Reset selected answer
      loadQuiz(); // Load the next question
    }, 2000); // 2-second delay
  } else {
    showResults(); // Show the final results
  }
}

// Display results at the end of the quiz
function showResults() {
  resultContainer.innerHTML = `<h3>Your Score: ${correctAnswers} / ${quizQuestions.length}</h3>`;

  if (wrongAnswers.length > 0) {
    resultContainer.innerHTML += "<h3>Incorrect Answers:</h3>";
   
    wrongAnswers.forEach(item => {
      resultContainer.innerHTML += `
        <p><strong>Question:</strong> ${item.question}</p>
        <p><strong>Your answer:</strong> ${item.selected}</p>
        <p><strong>Correct answer:</strong> ${item.correct}</p>
        <br>
      `;
    });
  } else {
    resultContainer.innerHTML += "<p>Congratulations! You answered all questions correctly.</p>";
  }
}

// Initialize Quiz
loadQuiz();




// Formation Quiz
function checkFormation(btn, isCorrect) {
  // Disable all buttons so they can't click again
  const allBtns = document.querySelectorAll('.formation-btn');
  allBtns.forEach(b => b.disabled = true);

  const resultDiv = document.getElementById('formation-result');

  if (isCorrect) {
    btn.classList.add('correct');
    resultDiv.textContent = '✅ Correct! The diagram shows a 4-2-3-1 formation.';
    resultDiv.style.color = '#4CAF50';
  } else {
    btn.classList.add('wrong');
    resultDiv.textContent = '❌ Not quite! The correct answer is 4-2-3-1.';
    resultDiv.style.color = '#f44336';

    // Highlight the correct answer in green
    allBtns.forEach(b => {
      if (b.textContent === '4-2-3-1') {
        b.classList.add('correct');
      }
    });
  }
}
