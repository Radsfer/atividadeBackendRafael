const express = require("express");
const fs= require("fs");  //da uma olhada na documentação no npm.


const connection = require("../config/database");

module.exports = (app)=>{
    const rotas = express.Router();

    rotas.get('/novarota', (req,res) =>{
        res.send("Nova rota para fornecedores");
    });

    app.get('/fornecedores', (req, res) => {
        connection.query(
          'select * from fornecedor',
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          }
        );
      });
     
      app.get('/fornecedores/:id_fornecedor', (req, res) => {
        var id_fornecedor = req.params.id_fornecedor
        connection.query(
          `select * from fornecedor where id_fornecedor = ${id_fornecedor}`,
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          });
      });
     
    
      app.post('/fornecedores',(req,res)=>{
        var razao = req.body.razao
        var cpf_cnpj = req.body.cpf_cnpj
        var contato = req.body.contato
        var logradouro = req.body.logradouro
        var cidade = req.body.cidade
        var uf = req.body.uf
        console.log(req.files)
        var sql =`insert into fornecedor (razao,cpf_cnpj,contato,logradouro, `+
        `cidade, uf) values("${razao}", "${cpf_cnpj}", `+
        `"${contato}","${logradouro}","${cidade}","${uf}")`
    
       
        connection.query(sql, (erro, resultado)=>{
          var caminhoTemp =req.files.logo.path;
          var caminhoFinal = `./uploads/logos/${resultado.insertId}.png`;
      
          if(erro) res.send(erro)
          fs.copyFile(caminhoTemp,caminhoFinal,
          (err)=>{
            console.log(err);
          })
          res.send(resultado)
        });
      });
    
      app.patch('/fornecedores/:id_fornecedor', (req, res) => {
        const id_fornecedor = req.params.id_fornecedor;
        var razao = req.body.razao
        var contato = req.body.contato
        var logradouro = req.body.logradouro
        var cidade = req.body.cidade
        var uf = req.body.uf
    
        var sql = `UPDATE fornecedor SET razao=?, contato=?, logradouro=?, cidade=?, uf=? WHERE id_fornecedor = ?`;
        connection.query(sql, [razao,contato,logradouro,cidade,uf,id_fornecedor], (error, result) => {
          if (error) {
            console.error('Erro ao atualizar o fornecedor:', error);
            res.status(500).json({ error: 'Erro ao atualizar o fornecedor.' });
          } else {
           
            console.log('Fornecedor atualizado com sucesso.',);
            res.status(200).json({ message: 'Fornecedor atualizado com sucesso.' });
          }
        });
      });
      
      
      app.delete('/fornecedores/:id_fornecedor', (req, res) => {
        const id_fornecedor = req.params.id_fornecedor;
      
        const sql = `DELETE FROM fornecedor WHERE id_fornecedor = ?`;
        connection.query(sql, [id_fornecedor], (error,results) => {
          if (error) {
            console.error('Erro ao excluir o fornecedor:', error);
            res.status(500).json({ error: 'Erro ao excluir o fornecedor.' });
          } else {
            console.log('Fornecedor excluído com sucesso.');
            res.status(200).json({ message: 'Fornecedor excluído com sucesso.' });
          }
        });
      });    

    app.use('/',rotas);
};