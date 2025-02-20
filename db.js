const knex = require('knex');

const db = knex({
    client: 'pg',  
    connection: {
      host: 'localhost', 
      port: '5432', 
      user: 'postgres',  
      password: 'bob',  
      database: 'victorina',
    }
  });

  async function createTable() {
    try {
      await db.schema.createTableIfNotExists('questions', (table) => {
        table.increments('id').primary();
        table.text('question'); 
        table.text('answer_1');
        table.text('answer_2');
        table.text('answer_3');
        table.text('answer_4');
        table.integer('correct_answer');
      });
      console.log('Table created');
    } catch (error) {
      console.error('Creating table error', error);
    }
  }
  
  async function insertQuestion(questionData) {
    try {
      await db('questions').insert(questionData);
      console.log('Вопрос успешно добавлен в базу данных');
    } catch (error) {
      console.error('Ошибка при вставке данных:', error);
    }
  }
  


  module.exports = {
    db,
    createTable
  };