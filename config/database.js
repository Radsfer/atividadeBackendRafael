const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
    user: 'aluno',
    database: 'aulas_web',
    password : 'alunoc3f3t',
  });

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'aula_bd',
//   password : 'P@ssw0rd',
// });


  module.exports = connection;