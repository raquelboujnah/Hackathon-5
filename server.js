const express = require('express');
const cors = require('cors');
const { db, createTable, insertQuestion } = require('./db');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());



const questions = [
    {
        "question": "What is the capital city of France?",
        "answer_1": "London",
        "answer_2": "Paris",
        "answer_3": "Rome",
        "answer_4": "Madrid",
        "correct_answer": 2
      },
      {
        "question": "Which planet is known as the Red Planet?",
        "answer_1": "Mars",
        "answer_2": "Venus",
        "answer_3": "Jupiter",
        "answer_4": "Saturn",
        "correct_answer": 1
      },
      {
        "question": "Who wrote the play 'Romeo and Juliet'?",
        "answer_1": "William Shakespeare",
        "answer_2": "Charles Dickens",
        "answer_3": "Jane Austen",
        "answer_4": "Mark Twain",
        "correct_answer": 1
      },
      {
        "question": "What is the largest mammal in the world?",
        "answer_1": "Elephant",
        "answer_2": "Blue Whale",
        "answer_3": "Giraffe",
        "answer_4": "Shark",
        "correct_answer": 2
      },
      {
        "question": "Which country is known as the Land of the Rising Sun?",
        "answer_1": "China",
        "answer_2": "Japan",
        "answer_3": "South Korea",
        "answer_4": "Thailand",
        "correct_answer": 2
      },
      {
        "question": "What is the smallest planet in our solar system?",
        "answer_1": "Mercury",
        "answer_2": "Venus",
        "answer_3": "Earth",
        "answer_4": "Mars",
        "correct_answer": 1
      },
      {
        "question": "Who painted the Mona Lisa?",
        "answer_1": "Vincent van Gogh",
        "answer_2": "Pablo Picasso",
        "answer_3": "Leonardo da Vinci",
        "answer_4": "Claude Monet",
        "correct_answer": 3
      },
      {
        "question": "Which animal is known for its ability to change color?",
        "answer_1": "Chameleon",
        "answer_2": "Tiger",
        "answer_3": "Elephant",
        "answer_4": "Panda",
        "correct_answer": 1
      },
      {
        "question": "Which element has the chemical symbol 'O'?",
        "answer_1": "Oxygen",
        "answer_2": "Osmium",
        "answer_3": "Ozone",
        "answer_4": "Opium",
        "correct_answer": 1
      },
      {
        "question": "What is the largest continent by land area?",
        "answer_1": "Africa",
        "answer_2": "Asia",
        "answer_3": "North America",
        "answer_4": "Australia",
        "correct_answer": 2
      }
];
app.listen(port, async () => {
    console.log(`erver is wirking on port ${port}`);
    
 await createTable(); 
 
 const existingQuestions = await db('questions').select('*');
 if (existingQuestions.length === 0) {
   try {
     for (const question of questions) {
       await insertQuestion(question); 
     }
     console.log('Вопросы успешно добавлены в базу данных');
   } catch (error) {
     console.error('Ошибка при добавлении вопросов:', error);
   }
 } else {
   console.log('Вопросы уже есть в базе данных, добавление не требуется.');
 }
});
 
  app.get('/questions', async (req, res) => {
    try {
      console.log('Запрос на получение вопросов...');
      const questions = await db('questions').select('*');
      console.log('Questions:', questions);
      res.json(questions);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error.message);  
      res.status(500).json({ error: 'Не удалось получить вопросы', details: error.message });
    }
  });
  
  app.post('/add-questions', async (req, res) => {
    const questions = req.body; 
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Тело запроса должно содержать массив вопросов' });
    }
  
    try {
      for (const questionData of questions) {
        const { question, answer_1, answer_2, answer_3, answer_4, correct_answer } = questionData;

        if (!question || !answer_1 || !answer_2 || !answer_3 || !answer_4 || correct_answer == null) {
          return res.status(400).json({ error: 'Все поля каждого вопроса должны быть заполнены' });
        }
  
        await insertQuestion(questionData);
      }
      
      res.status(200).json({ message: 'Вопросы успешно добавлены' });
    } catch (error) {
      console.error('Ошибка при вставке вопросов:', error);
      res.status(500).json({ error: 'Не удалось добавить вопросы' });
    }
  });