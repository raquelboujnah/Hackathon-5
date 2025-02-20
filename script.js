const questionText = document.getElementById("question-text");
const answersList = document.getElementById("answers-list");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let questions = [];
let correctAnswersCount = 0; 


async function loadQuestions() {
  try {
    const response = await fetch("http://localhost:5000/questions");
    if (!response.ok) {
      throw new Error("Не удалось загрузить вопросы: " + response.statusText);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Вопросы не найдены");
    }
    questions = data;
    loadQuestion(currentQuestionIndex); 
  } catch (error) {
    console.error("loading erroe", error);
    alert("Loading error: " + error.message);
  }
}

// Функция для отображения вопроса
function loadQuestion(index) {
  console.log("Загружаем вопрос с индексом:", index); 
  const question = questions[index];
  questionText.textContent = question.question;

  answersList.innerHTML = ""; 
  for (let i = 1; i <= 4; i++) {
    const answer = question[`answer_${i}`];
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", () => checkAnswer(i, li)); 
    answersList.appendChild(li);
  }

  nextButton.style.display = "none"; 
}

function checkAnswer(selectedAnswer, liElement) {
  const correctAnswer = questions[currentQuestionIndex].correct_answer;
  console.log("User chose anser", selectedAnswer);
  console.log("Correct answer", correctAnswer);

  if (selectedAnswer === correctAnswer) {
    correctAnswersCount++; 
    liElement.style.backgroundColor = "green"; 
  } else {
    liElement.style.backgroundColor = "red"; 
  }

  const allAnswers = liElement.parentElement.children;
  for (let i = 0; i < allAnswers.length; i++) {
    const answerElement = allAnswers[i];
    if (i + 1 === correctAnswer) {
      answerElement.style.backgroundColor = "green"; 
    }
  }

  nextButton.style.display = "block"; 
  nextButton.disabled = false; 
}

nextButton.addEventListener("click", () => {
  console.log('Нажата кнопка "Next"'); 
  currentQuestionIndex++; 
  console.log("Текущий индекс вопроса:", currentQuestionIndex); 
  if (currentQuestionIndex < questions.length) {
    console.log("Загружаем следующий вопрос:", currentQuestionIndex); 
    loadQuestion(currentQuestionIndex); 
  } else {
    
    showResults(); 
  }
});

function showResults() {
  alert(
    `Test completed! You are right on ${correctAnswersCount} from ${questions.length} questions.`,
  );
}

loadQuestions();
