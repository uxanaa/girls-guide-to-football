function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute('content') : '';
}

// Restore saved tab on refresh, but go home on new visit
// We use sessionStorage to store the tab, and a flag to detect
// whether this is a refresh or a brand new visit
(function() {
  // Check if this is a refresh or a new visit
  var isRefresh = sessionStorage.getItem('visited');
  
  if (isRefresh) {
    // Page was refreshed — restore the saved tab
    var savedTab = sessionStorage.getItem('activeTab');
    if (savedTab && savedTab !== '#tab_1') {
      var allTabs = document.querySelectorAll('[data-tab-info]');
      allTabs.forEach(function(t) { t.classList.remove('active'); });
      var target = document.querySelector(savedTab);
      if (target) target.classList.add('active');
    }
  } else {
    // Brand new visit, mark as visited and go to home
    sessionStorage.setItem('visited', 'true');
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
    sessionStorage.setItem('activeTab', tab.dataset.tabValue);
  })
})

    // Example player positions
    const players = [
    { name: "Player 1", position: "Goalkeeper", x: 574, y: 160, info: "Role: Protect the goal and prevent the opposing team from scoring." },
    { name: "Player 2", position: "Right Back", x: 435, y: 30, info: "Role: Defend the right side and support attacks down the wing." },
    { name: "Player 3", position: "Left Back", x: 435, y: 265, info: "Role: Defend the left side and support attacks down the wing." },
    { name: "Player 4", position: "Centre Back (CB)", x: 467, y: 204, info: "Role: Mark opposition attackers and move the ball away from danger." },
    { name: "Player 5", position: "Centre Back (CB)", x: 467, y: 102, info: "Role: Mark opposition attackers and move the ball away from danger." },
    { name: "Player 6", position: "Defensive Midfielder", x: 380, y: 114, info: "Role: Stop the opposition from scoring and help the team build play from the back." },
    { name: "Player 7", position: "Left Wing", x: 231, y: 243, info: "Role: Attack down the left, beat defenders and create chances or score." },
    { name: "Player 8", position: "Central Midfielder", x: 359, y: 192, info: "Role: Link defence and attack, control the tempo and support both ends of the pitch." },
    { name: "Player 9", position: "Striker", x: 175, y: 147, info: "Role: Lead the attack and score goals." },
    { name: "Player 10", position: "Attacking Midfielder", x: 279, y: 149, info: "Role: Create scoring chances and support the striker in attack." },
    { name: "Player 11", position: "Right Wing", x: 230, y: 46, info: "Role: Attack down the right, beat defenders and create chances or score." },
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
    question: "In which country is the Premier League played?",
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
    options: ["The match always ends immediately", "Extra time may be played", "The losing team gets a point", "The match is automatically cancelled"],
    correct: 1
  },
  {
    question: "Which of these competitions is played between the top European club teams?",
    options: ["La Liga", "FA Cup", "UEFA Champions League", "Copa del Rey"],
    correct: 2
  },
  {
    question: "What is the offside rule in football?",
    options: ["A player can't be closer to the opponent's goal line than the last defender.", "A player can't be behind the midfield line.", "A player can't be closer to the opponent's goal line than the second-last defender when the ball is passed to them.", "A player must always stay behind the ball."],
    correct: 2
  },
  {
    question: "What is a 'hat-trick' in football?",
    options: ["Scoring two goals in one match", "Assisting three goals in one match", "Saving three penalties in one match", "Scoring three goals in one match"],
    correct: 3
  },
  {
    question: "Which country won the 2025 women's Euros?",
    options: ["Spain", "England", "Germany", "France"],
    correct: 1
  },
  {
    question: "What is England's women's national football team commonly known as?",
    options: ["The Roses", "The Lionesses", "The Three Lions", "The Robins"],
    correct: 1
  },
  {
    question: "What is the top women's football league in England called?",
    options: ["The women's Premier League", "The women's Super League (WSL)", "The FA women's Cup", "The women's Championship"],
    correct: 1
  },
  {
    question: "Who is the manager that led England's Lionesses to their 2025 Euros win?",
    options: ["Emma Hayes", "Sarina Wiegman", "Casey Stoney", "Hope Powell"],
    correct: 1
  },
  {
    question: "The same positions, striker, midfielder, defender, are used in both men's and womens football. True or false?",
    options: ["True", "False", "Only in the WSL", "Only at World Cups"],
    correct: 0
  },
  {
    question: "How often is the Women's World Cup held?",
    options: ["Every year", "Every two years", "Every four years", "Every six years"],
    correct: 2
  },
  {
    question: "Which of these is a major international women's football tournament?",
    options: ["The Women's Ryder Cup", "The Women's World Cup", "The Women's Masters", "The Women's Open"],
    correct: 1
  },
  {
    question: "The UEFA Women's Champions League is a competition between what?",
    options: ["National teams", "Top European women's club teams", "University teams", "Regional teams"],
    correct: 1
  },
  {
    question: "England's Lionesses won the Women's Euros in 2022 and again in which year?",
    options: ["2023", "2024", "2025", "2026"],
    correct: 2
  },
  {
    question: "Women's football has grown rapidly in recent years, with record crowds and rising transfer fees. True or false?",
    options: ["True", "False", "Only in England", "Only during World Cups"],
    correct: 0
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
  selectedAnswer = index;
  const answerButtons = document.querySelectorAll(".answer");

  // Highlight correct and wrong, disable all
  answerButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === index && index !== quizQuestions[currentQuiz].correct) {
      btn.classList.add("wrong");
    }
    if (i === quizQuestions[currentQuiz].correct) {
      btn.classList.add("correct");
    }
  });

  // Show correct/wrong message
  if (index === quizQuestions[currentQuiz].correct) {
    resultContainer.textContent = "✅ Correct!";
    resultContainer.style.color = "#4CAF50";
    correctAnswers++;
  } else {
  resultContainer.textContent = "❌ Wrong!";
  resultContainer.style.color = "#f44336";
  // Record the miss so we can review it at the end
  const q = quizQuestions[currentQuiz];
  wrongAnswers.push({
    question: q.question,
    yourAnswer: q.options[index],
    correctAnswer: q.options[q.correct]
  });
  }

  // Move to next question
  currentQuiz++;

  // Show Next button or Finish button
  if (currentQuiz < quizQuestions.length) {
    resultContainer.innerHTML += `
      <br><button onclick="loadQuiz()" style="
        margin-top:10px;
        padding:10px 24px;
        background:#EB178F;
        color:white;
        border:none;
        border-radius:8px;
        font-size:14px;
        font-family:'Lora',serif;
        font-weight:bold;
        cursor:pointer;
      ">Next Question ➡️</button>`;
  } else {
    resultContainer.innerHTML += `
      <br><button onclick="showResults()" style="
        margin-top:10px;
        padding:10px 24px;
        background:#EB178F;
        color:white;
        border:none;
        border-radius:8px;
        font-size:14px;
        font-family:'Lora',serif;
        font-weight:bold;
        cursor:pointer;
      ">See Results 🏆</button>`;
  }
}

// Display results at the end of the quiz
function showResults() {
  quizContainer.innerHTML = '';
  remainingQuestionsContainer.innerHTML = '';
  let reviewHtml = '';
  if (wrongAnswers.length === 0) {
    reviewHtml = `<p style="color:#4CAF50;font-weight:bold;margin-top:1rem;">🌟 You didn't get a single one wrong!</p>`;
  } else {
    reviewHtml = `<h4 style="color:#EB178F;margin-top:1.5rem;">Review your ${wrongAnswers.length} incorrect answer(s):</h4>
      <div style="max-width:600px;margin:0.5rem auto;text-align:left;">`;
    wrongAnswers.forEach((item, i) => {
      reviewHtml += `
        <div style="border:1px solid #f0b8d8;border-radius:8px;padding:12px;margin-bottom:10px;background:#fff9fc;">
          <p style="font-weight:bold;margin:0 0 6px 0;">${i + 1}. ${escapeQuizHtml(item.question)}</p>
          <p style="margin:0;color:#f44336;">Your answer: ${escapeQuizHtml(item.yourAnswer)}</p>
          <p style="margin:0;color:#4CAF50;">Correct answer: ${escapeQuizHtml(item.correctAnswer)}</p>
        </div>`;
    });
    reviewHtml += `</div>`;
  }
  resultContainer.innerHTML = `
    <h3>Your Score: ${correctAnswers} / ${quizQuestions.length}</h3>
    <p style="color:#888; font-family:'Source Sans Pro',sans-serif;">
      ${correctAnswers === quizQuestions.length 
        ? '🎉 Perfect score! You know your football!' 
        : correctAnswers >= 7 
        ? 'Great effort!' 
        : 'Keep practising!'}
    </p>
    ${reviewHtml}
    <button onclick="restartQuiz()" style="
      margin-top:10px;
      padding:10px 24px;
      background:#EB178F;
      color:white;
      border:none;
      border-radius:8px;
      font-size:14px;
      font-family:'Lora',serif;
      font-weight:bold;
      cursor:pointer;
    ">Play Again ⚽</button>
  `;

  // Save score to Flask if logged in
  fetch('/save_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
      body: JSON.stringify({ score: correctAnswers, total: quizQuestions.length })
    }).catch(() => {});
}

function restartQuiz() {
  currentQuiz = 0;
  correctAnswers = 0;
  wrongAnswers = [];
  selectedAnswer = null;
  quizQuestions = getRandomQuestions();
  loadQuiz();
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

// Stop quiz text injecting HTML
function escapeQuizHtml(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


function escapeQuizHtml(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


/* ============================================================
   WOMEN'S FOOTBALL
   ============================================================ */


/* ------------------------------------------------------------
   WOMEN'S FOOTBALL DATA
   ------------------------------------------------------------ */

const womensFootballCountries = [

  {
    country: "England",
    flag: "🏴",
    continent: "Europe",
    league: "Women's Super League (WSL)",
    nationalTeam: "England Women's National Team",
    clubs: "Chelsea, Arsenal, Manchester United",
    competition: "UEFA Women's Champions League",
    fact: "England's senior women's team are known as the Lionesses."
  },

  {
    country: "Spain",
    flag: "🇪🇸",
    continent: "Europe",
    league: "Liga F",
    nationalTeam: "Spain Women's National Team",
    clubs: "Barcelona, Real Madrid, Atlético Madrid",
    competition: "UEFA Women's Champions League",
    fact: "Barcelona have become one of the dominant clubs in European women's football."
  },

  {
    country: "France",
    flag: "🇫🇷",
    continent: "Europe",
    league: "Première Ligue",
    nationalTeam: "France Women's National Team",
    clubs: "OL Lyonnes, Paris FC, Paris Saint-Germain",
    competition: "UEFA Women's Champions League",
    fact: "OL Lyonnes are the record winners of the UEFA Women's Champions League."
  },

  {
    country: "Germany",
    flag: "🇩🇪",
    continent: "Europe",
    league: "Frauen-Bundesliga",
    nationalTeam: "Germany Women's National Team",
    clubs: "Bayern Munich, Wolfsburg, Eintracht Frankfurt",
    competition: "UEFA Women's Champions League",
    fact: "Germany has a long and successful history in women's international football."
  },

  {
    country: "United States",
    flag: "🇺🇸",
    continent: "Americas",
    league: "National Women's Soccer League (NWSL)",
    nationalTeam: "United States Women's National Team",
    clubs: "NJ/NY Gotham FC, Portland Thorns, Orlando Pride",
    competition: "FIFA Women's World Cup",
    fact: "The United States has been one of the most successful teams in Women's World Cup history."
  },

  {
    country: "Brazil",
    flag: "🇧🇷",
    continent: "Americas",
    league: "Campeonato Brasileiro Feminino",
    nationalTeam: "Brazil Women's National Team",
    clubs: "Corinthians, Palmeiras, São Paulo",
    competition: "Copa América Femenina",
    fact: "Brazil has produced some of the most famous players in women's football."
  },

  {
    country: "Canada",
    flag: "🇨🇦",
    continent: "Americas",
    league: "Northern Super League",
    nationalTeam: "Canada Women's National Team",
    clubs: "Canadian professional clubs",
    competition: "CONCACAF competitions",
    fact: "Canada won Olympic gold in women's football at Tokyo 2020."
  },

  {
    country: "Japan",
    flag: "🇯🇵",
    continent: "Asia",
    league: "WE League",
    nationalTeam: "Japan Women's National Team",
    clubs: "INAC Kobe Leonessa, Urawa Reds",
    competition: "AFC Women's Asian Cup",
    fact: "Japan won the 2011 FIFA Women's World Cup."
  },

  {
    country: "Australia",
    flag: "🇦🇺",
    continent: "Oceania",
    league: "A-League Women",
    nationalTeam: "Australia Women's National Team",
    clubs: "Melbourne City, Sydney FC, Brisbane Roar",
    competition: "AFC Women's Asian Cup",
    fact: "Australia co-hosted the 2023 FIFA Women's World Cup."
  },

  {
    country: "New Zealand",
    flag: "🇳🇿",
    continent: "Oceania",
    league: "National Women's League",
    nationalTeam: "New Zealand Women's National Team",
    clubs: "New Zealand professional and regional clubs",
    competition: "OFC Women's Nations Cup",
    fact: "New Zealand co-hosted the 2023 FIFA Women's World Cup."
  },

  {
    country: "Nigeria",
    flag: "🇳🇬",
    continent: "Africa",
    league: "Nigeria Women's Football League",
    nationalTeam: "Nigeria Women's National Team",
    clubs: "Major Nigerian women's clubs",
    competition: "Women's Africa Cup of Nations",
    fact: "Nigeria has been one of Africa's strongest women's national teams."
  },

  {
    country: "South Africa",
    flag: "🇿🇦",
    continent: "Africa",
    league: "Hollywoodbets Super League",
    nationalTeam: "South Africa Women's National Team",
    clubs: "Mamelodi Sundowns Ladies and other domestic clubs",
    competition: "Women's Africa Cup of Nations",
    fact: "South Africa won the Women's Africa Cup of Nations in 2022."
  }

];


/* ------------------------------------------------------------
   RECORD DATA
   ------------------------------------------------------------ */

const womensFootballRecords = [

  {
    category: "international",
    icon: "🌍",
    number: "190+",
    title: "International goals",
    holder: "Christine Sinclair",
    description: "Canada's Christine Sinclair became the all-time leading scorer in senior international football.",
    detail: "Her scoring record includes goals for Canada across multiple international tournaments."
  },

  {
    category: "worldcup",
    icon: "🏆",
    number: "17",
    title: "Women's World Cup goals",
    holder: "Marta",
    description: "Brazil legend Marta holds the record for most FIFA Women's World Cup goals.",
    detail: "She scored across five different Women's World Cup tournaments."
  },

  {
    category: "worldcup",
    icon: "🇺🇸",
    number: "4",
    title: "Women's World Cup titles",
    holder: "United States",
    description: "The United States has won the FIFA Women's World Cup four times.",
    detail: "Their victories came in 1991, 1999, 2015 and 2019."
  },

  {
    category: "uwcl",
    icon: "⭐",
    number: "8",
    title: "Women's Champions League titles",
    holder: "OL Lyonnes",
    description: "OL Lyonnes are the record winners of the UEFA Women's Champions League.",
    detail: "They have won the competition eight times."
  },

  {
    category: "uwcl",
    icon: "🏆",
    number: "4",
    title: "Women's Champions League titles",
    holder: "Barcelona",
    description: "Barcelona have won the UEFA Women's Champions League four times.",
    detail: "Their latest victory came in the 2025/26 season."
  },

  {
    category: "club",
    icon: "⚽",
    number: "4",
    title: "European titles",
    holder: "Barcelona",
    description: "Barcelona have established themselves as one of Europe's leading women's clubs.",
    detail: "Their four Women's Champions League victories came in 2021, 2023, 2024 and 2026."
  },

  {
    category: "international",
    icon: "🇨🇦",
    number: "300+",
    title: "International appearances",
    holder: "Christine Sinclair",
    description: "Sinclair has represented Canada hundreds of times at senior international level.",
    detail: "Her international career is one of the longest and most decorated in football."
  },

  {
    category: "uwcl",
    icon: "👑",
    number: "8",
    title: "Women's Champions League titles",
    holder: "Wendie Renard",
    description: "Wendie Renard has won the Women's Champions League eight times with OL Lyonnes.",
    detail: "UEFA records list her alongside Eugénie Le Sommer with eight titles."
  }

];


/* ------------------------------------------------------------
  PLAYER AND TEAM DATA
   ------------------------------------------------------------ */

const womensFootballProfiles = [

  {
    type: "player",
    name: "Aitana Bonmatí",
    icon: "⭐",
    image: "/static/images/aitana-bonmati.jpg",
    country: "Spain 🇪🇸",
    position: "Midfielder",
    era: "Barcelona / Spain",
    description: "An elite midfielder known for her vision, creativity, technical ability and major trophies for club and country.",
    achievements: [
      "UEFA Women's Champions League winner",
      "World Cup winner with Spain",
      "Ballon d'Or Féminin winner"
    ],
    fact: "Bonmatí is renowned for her close control, movement, passing and ability to influence important matches."
  },

  {
    type: "player",
    name: "Mariona Caldentey",
    icon: "⭐",
    image: "/static/images/mariona-caldentey.jpg",
    country: "Spain 🇪🇸",
    position: "Forward / Midfielder",
    era: "Arsenal / Spain",
    description: "A versatile playmaker known for her technical skill, intelligence and ability to adapt across attacking positions.",
    achievements: [
      "UEFA Women's Champions League winner",
      "Major domestic trophies with Barcelona",
      "European Championship winner with Spain"
    ],
    fact: "Caldentey is valued for her ability to create chances, combine with teammates and play in several attacking roles."
  },

  {
    type: "player",
    name: "Alessia Russo",
    icon: "⚽",
    image: "/static/images/alessia-russo.jpg",
    country: "England 🏴",
    position: "Forward",
    era: "Arsenal / England",
    description: "A clinical forward who has become known for scoring important goals for both Arsenal and England.",
    achievements: [
      "UEFA Women's Champions League winner",
      "UEFA Women's Euro winner with England",
      "FA Women's League Cup winner"
    ],
    fact: "Russo combines movement, finishing and physical strength to create problems for defenders."
  },

  {
    type: "player",
    name: "Alexia Putellas",
    icon: "👑",
    image: "/static/images/alexia-putellas.jpg",
    country: "Spain 🇪🇸",
    position: "Midfielder",
    era: "Barcelona / Spain",
    description: "A legendary Barcelona midfielder celebrated for her technical brilliance, creativity and leadership.",
    achievements: [
      "Multiple UEFA Women's Champions League titles",
      "Two Ballon d'Or Féminin awards",
      "Multiple Spanish league titles"
    ],
    fact: "Putellas is one of the most decorated and recognisable players of her generation."
  },

  {
    type: "player",
    name: "Hannah Hampton",
    icon: "🧤",
    image: "/static/images/hannah-hampton.jpg",
    country: "England 🏴",
    position: "Goalkeeper",
    era: "Chelsea / England",
    description: "A talented goalkeeper known for her shot-stopping, composure and ability to make important saves.",
    achievements: [
      "UEFA Women's Euro winner with England",
      "Major domestic trophies",
      "England international goalkeeper"
    ],
    fact: "Hampton has developed into one of England's leading goalkeepers."
  },

  {
    type: "player",
    name: "Temwa Chawinga",
    icon: "⚡",
    image: "/static/images/temwa-chawinga.jpg",
    country: "Malawi 🇲🇼",
    position: "Forward",
    era: "Kansas City Current / Malawi",
    description: "A prolific forward famous for her incredible pace, direct attacking style and goal-scoring ability.",
    achievements: [
      "NWSL Golden Boot winner",
      "Record-breaking NWSL performances",
      "Malawi international"
    ],
    fact: "Chawinga is known for using her speed to get behind defenders and create scoring opportunities."
  },

  {
    type: "player",
    name: "Patri Guijarro",
    icon: "🎯",
    image: "/static/images/patri-guijarro.jpg",
    country: "Spain 🇪🇸",
    position: "Defensive Midfielder",
    era: "Barcelona / Spain",
    description: "A highly intelligent midfielder who combines defensive strength with excellent passing and game control.",
    achievements: [
      "Multiple UEFA Women's Champions League titles",
      "Multiple Spanish league titles",
      "Major domestic cup winner"
    ],
    fact: "Guijarro is particularly effective at winning the ball and helping her team control the tempo."
  },

  {
    type: "player",
    name: "Ewa Pajor",
    icon: "⚽",
    image: "/static/images/ewa-pajor.jpg",
    country: "Poland 🇵🇱",
    position: "Striker",
    era: "Barcelona / Poland",
    description: "A powerful and prolific striker known for her movement, finishing and ability to score consistently.",
    achievements: [
      "Multiple German league titles",
      "UEFA Women's Champions League winner",
      "Poland international"
    ],
    fact: "Pajor is one of Poland's most successful women's footballers and has become a major attacking threat for Barcelona."
  },

  {
    type: "player",
    name: "Claudia Pina",
    icon: "⭐",
    image: "/static/images/claudia-pina.jpg",
    country: "Spain 🇪🇸",
    position: "Forward",
    era: "Barcelona / Spain",
    description: "A technically gifted forward known for her finishing, movement and ability to create chances.",
    achievements: [
      "UEFA Women's Champions League winner",
      "Multiple Spanish league titles",
      "Multiple domestic cup victories"
    ],
    fact: "Pina developed through Barcelona's youth system and has become an important attacking player."
  },

  {
    type: "player",
    name: "Leah Williamson",
    icon: "🛡️",
    image: "/static/images/leah-williamson.jpg",
    country: "England 🏴",
    position: "Centre-back",
    era: "Arsenal / England",
    description: "A composed and intelligent defender known for her leadership, passing ability and tactical awareness.",
    achievements: [
      "UEFA Women's Euro winner with England",
      "England captain",
      "FA Women's Cup winner"
    ],
    fact: "Williamson captained England to the UEFA Women's Euro 2022 title and again captained the Lionesses to victory at Euro 2025."
  },

  {
    type: "team",
    name: "FC Barcelona Women",
    icon: "🔵🔴",
    country: "Spain 🇪🇸",
    position: "Club",
    era: "Barcelona",
    description: "One of the leading clubs in modern women's football.",
    achievements: [
      "Four UEFA Women's Champions League titles",
      "Multiple Spanish league titles",
      "Multiple Copa de la Reina victories"
    ],
    fact: "Barcelona are one of the dominant clubs in modern women's football."
  },

  {
    type: "team",
    name: "OL Lyonnes",
    icon: "🔵🔴",
    country: "France 🇫🇷",
    position: "Club",
    era: "France",
    description: "The most successful club in UEFA Women's Champions League history.",
    achievements: [
      "Eight UEFA Women's Champions League titles",
      "Numerous French league titles",
      "One of Europe's most successful women's clubs"
    ],
    fact: "OL Lyonnes hold the record for Women's Champions League titles."
  },

  {
    type: "team",
    name: "Arsenal Women",
    icon: "🔴⚪",
    country: "England 🏴",
    position: "Club",
    era: "England",
    description: "One of England's most historically successful women's clubs.",
    achievements: [
      "UEFA Women's Champions League winner",
      "Multiple English league titles",
      "Multiple FA Women's Cup victories"
    ],
    fact: "Arsenal are one of the pioneering clubs in English women's football."
  },

  {
    type: "team",
    name: "United States Women's National Team",
    icon: "🇺🇸",
    country: "United States",
    position: "National team",
    era: "International",
    description: "One of the most successful women's national teams in football history.",
    achievements: [
      "Four FIFA Women's World Cup titles",
      "Multiple Olympic medals",
      "Multiple CONCACAF titles"
    ],
    fact: "The United States won the first Women's World Cup in 1991."
  }

];


/* ============================================================
   WOMEN'S SECTION NAVIGATION
   ============================================================ */

function showWomenSection(sectionId, button) {

  const sections = document.querySelectorAll('.women-section');

  sections.forEach(section => {
    section.classList.remove('active');
  });

  const target = document.getElementById(sectionId);

  if (target) {
    target.classList.add('active');
  }

  const buttons = document.querySelectorAll('.women-section-btn');

  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  if (button) {
    button.classList.add('active');
  }

}


/* ============================================================
   COUNTRY CARDS
   ============================================================ */

function renderCountries(countryList) {

  const container = document.getElementById('countryCards');

  if (!container) {
    return;
  }

  if (countryList.length === 0) {

    container.innerHTML = `
      <div class="women-no-results">
        No countries found.
      </div>
    `;

    return;
  }


  container.innerHTML = countryList.map(country => `

    <article class="country-card">

      <div class="country-flag">
        ${country.flag}
      </div>

      <h3>${escapeWomenHtml(country.country)}</h3>

      <h4>🏟️ Main league</h4>
      <p>${escapeWomenHtml(country.league)}</p>

      <h4>🌍 National team</h4>
      <p>${escapeWomenHtml(country.nationalTeam)}</p>

      <h4>⭐ Notable clubs</h4>
      <p>${escapeWomenHtml(country.clubs)}</p>

      <h4>🏆 Major competition</h4>
      <p>${escapeWomenHtml(country.competition)}</p>

      <div class="country-fact">
        <strong>💡 Did you know?</strong>
        <p>${escapeWomenHtml(country.fact)}</p>
      </div>

    </article>

  `).join('');

}


function filterCountries(continent, button) {

  const buttons = document.querySelectorAll('.women-filter');

  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  if (button) {
    button.classList.add('active');
  }


  let filteredCountries;

  if (continent === 'all') {

    filteredCountries = womensFootballCountries;

  } else {

    filteredCountries = womensFootballCountries.filter(
      country => country.continent === continent
    );

  }

  renderCountries(filteredCountries);

}


/* ============================================================
  RECORD CARDS
   ============================================================ */

function renderRecords(recordList) {

  const container = document.getElementById('recordsGrid');

  if (!container) {
    return;
  }


  if (recordList.length === 0) {

    container.innerHTML = `
      <div class="women-no-results">
        No records found.
      </div>
    `;

    return;
  }


  container.innerHTML = recordList.map(record => `

    <article class="record-card">

      <div class="record-icon">
        ${record.icon}
      </div>

      <div class="record-number">
        ${escapeWomenHtml(record.number)}
      </div>

      <h3>
        ${escapeWomenHtml(record.title)}
      </h3>

      <p class="record-holder">
        ${escapeWomenHtml(record.holder)}
      </p>

      <p>
        ${escapeWomenHtml(record.description)}
      </p>

      <div class="country-fact">
        <strong>📖 More:</strong>
        <p>${escapeWomenHtml(record.detail)}</p>
      </div>

    </article>

  `).join('');

}


function filterRecords(category, button) {

  const buttons = document.querySelectorAll('.record-filter');

  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  if (button) {
    button.classList.add('active');
  }


  let filteredRecords;

  if (category === 'all') {

    filteredRecords = womensFootballRecords;

  } else {

    filteredRecords = womensFootballRecords.filter(
      record => record.category === category
    );

  }

  renderRecords(filteredRecords);

}


/* ============================================================
   PLAYER / TEAM CARDS
   ============================================================ */

let currentProfileFilter = 'all';


function renderProfiles(profileList) {

  const container = document.getElementById('profilesGrid');

  if (!container) {
    return;
  }


  if (profileList.length === 0) {

    container.innerHTML = `
      <div class="women-no-results">
        No players or teams found.
      </div>
    `;

    return;
  }


  container.innerHTML = profileList.map((profile, index) => `

    <article
      class="profile-card"
      onclick="openWomenProfile(${index})"
    >

      ${profile.image
      ? `<img
          class="profile-image"
          src="${profile.image}"
          alt="${escapeWomenHtml(profile.name)}"
          loading="lazy"
        >`
      : `<div class="profile-icon">${profile.icon}</div>`
    }

      <h3>
        ${escapeWomenHtml(profile.name)}
      </h3>

      <span class="profile-type">
        ${profile.type === 'player' ? '👤 Player' : '🏟️ Team'}
      </span>

      <p>
        ${escapeWomenHtml(profile.country)}
      </p>

      <p>
        ${escapeWomenHtml(profile.position)}
      </p>

      <p>
        ${escapeWomenHtml(profile.description)}
      </p>

      <strong style="color:#EB178F;">
        Click to learn more →
      </strong>

    </article>

  `).join('');

}


/*
 * Important:
 * When search/filtering, the cards need to know which item
 * from the original data they represent.
 */

function getFilteredProfiles() {

  const searchInput = document.getElementById('profileSearch');

  const searchTerm = searchInput
    ? searchInput.value.toLowerCase().trim()
    : '';


  return womensFootballProfiles.filter(profile => {

    const matchesType =
      currentProfileFilter === 'all' ||
      profile.type === currentProfileFilter;


    const searchableText = `
      ${profile.name}
      ${profile.country}
      ${profile.position}
      ${profile.description}
      ${profile.fact}
    `.toLowerCase();


    const matchesSearch =
      !searchTerm ||
      searchableText.includes(searchTerm);


    return matchesType && matchesSearch;

  });

}


function renderFilteredProfiles() {

  const filtered = getFilteredProfiles();

  const container = document.getElementById('profilesGrid');

  if (!container) {
    return;
  }

  if (filtered.length === 0) {

    container.innerHTML = `
      <div class="women-no-results">
        No players or teams match your search.
      </div>
    `;

    return;
  }

  container.innerHTML = filtered.map((profile) => {

    const originalIndex =
      womensFootballProfiles.indexOf(profile);

    return `

      <article
        class="profile-card"
        onclick="openWomenProfile(${originalIndex})"
      >

        ${
          profile.image
            ? `<img
                class="profile-image"
                src="${profile.image}"
                alt="${escapeWomenHtml(profile.name)}"
                loading="lazy"
              >`
            : `<div class="profile-icon">${profile.icon}</div>`
        }

        <h3>
          ${escapeWomenHtml(profile.name)}
        </h3>

        <span class="profile-type">
          ${profile.type === 'player' ? '👤 Player' : '🏟️ Team'}
        </span>

        <p>
          ${escapeWomenHtml(profile.country)}
        </p>

        <p>
          ${escapeWomenHtml(profile.position)}
        </p>

        <p>
          ${escapeWomenHtml(profile.description)}
        </p>

        <strong style="color:#EB178F;">
          Click to learn more →
        </strong>

      </article>

    `;

  }).join('');

}

function filterProfiles(type, button) {

  currentProfileFilter = type;


  const buttons = document.querySelectorAll('.profile-filter');

  buttons.forEach(btn => {
    btn.classList.remove('active');
  });


  if (button) {
    button.classList.add('active');
  }


  renderFilteredProfiles();

}


function searchProfiles() {

  renderFilteredProfiles();

}


/* ============================================================
   PLAYER / TEAM POPUP
   ============================================================ */

function openWomenProfile(index) {

  const profile =
    womensFootballProfiles[index];

  if (!profile) {
    return;
  }


  const modal =
    document.getElementById('womenProfileModal');

  const details =
    document.getElementById('womenProfileDetails');


  if (!modal || !details) {
    return;
  }


  const achievementsHtml =
    profile.achievements.map(item => `
      <li>${escapeWomenHtml(item)}</li>
    `).join('');


  details.innerHTML = `

    <div class="women-modal-icon">
      ${profile.icon}
    </div>

    <h1 class="women-modal-title">
      ${escapeWomenHtml(profile.name)}
    </h1>

    <p class="women-modal-subtitle">
      ${escapeWomenHtml(profile.country)}
      •
      ${escapeWomenHtml(profile.position)}
    </p>

    <div class="women-detail-box">

      <strong>About</strong>

      <p>
        ${escapeWomenHtml(profile.description)}
      </p>

    </div>


    <div class="women-detail-box">

      <strong>🏆 Achievements</strong>

      <ul>
        ${achievementsHtml}
      </ul>

    </div>


    <div class="women-detail-box">

      <strong>💡 Did you know?</strong>

      <p>
        ${escapeWomenHtml(profile.fact)}
      </p>

    </div>

  `;


  modal.classList.add('show');

}


function closeWomenProfile() {

  const modal =
    document.getElementById('womenProfileModal');

  if (modal) {
    modal.classList.remove('show');
  }

}


/* Close modal when clicking outside */

window.addEventListener('click', function(event) {

  const modal =
    document.getElementById('womenProfileModal');

  if (event.target === modal) {
    closeWomenProfile();
  }

});


/* Close modal with Escape */

window.addEventListener('keydown', function(event) {

  if (event.key === 'Escape') {
    closeWomenProfile();
  }

});


/* ============================================================
   SECURITY / HTML ESCAPING
   ============================================================ */

function escapeWomenHtml(text) {

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


/* ============================================================
   INITIALISE WOMEN'S FOOTBALL
   ============================================================ */

function initialiseWomensFootball() {

  renderCountries(womensFootballCountries);

  renderRecords(womensFootballRecords);

  renderFilteredProfiles();

}

initialiseWomensFootball();