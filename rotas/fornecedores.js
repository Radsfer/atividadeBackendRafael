const express = require("express");
const fs= require("fs");  //da uma olhada na documentação no npm.


const connection = require("../config/database");

module.exports = (app)=>{
    const rotas = express.Router();

    rotas.get('/novarota', (req,res) =>{
        res.send("Nova rota para fornecedores");
    });

    rotas.get('/fornecedores_all', (req, res) => {
      
        connection.query(
          `select * from fornecedor order by id_fornecedor desc limit 10`,
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          }
        );
      });

      rotas.get('/fornecedores', (req, res) => {
      
        connection.query(
          `select * from fornecedor`,
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          }
        );
      });
     
      rotas.get('/fornecedores_byid/:id_fornecedor', (req, res) => {
        var id_fornecedor = req.params.id_fornecedor
        connection.query(
          `select * from fornecedor where id_fornecedor = ${id_fornecedor}`,
          (err, results, fields) => {
            if(err) console.log(err)
            console.log(results)
          var resultado= {}
          if(results.length > 0){
            resultado.id_fornecedor=results[0].id_fornecedor
            resultado.razao=results[0].razao
            resultado.cpf_cnpj=results[0].cpf_cnpj
            resultado.contato=results[0].contato
            resultado.logradouro=results[0].logradouro
            resultado.cidade=results[0].cidade
            resultado.uf=results[0].uf
          }
          res.send(resultado)
          }
          );
      });
     
      rotas.post('/fornecedores_del/:id_fornecedor', (req, res) => {
        var id_fornecedor=req.params.id_fornecedor;
        connection.query(
          `delete from fornecedor where id_fornecedor = ${id_fornecedor}`,
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          }
        );
      });
    
      rotas.post('/fornecedores',(req,res)=>{
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
          var caminhoTemp =req.files.avatar.path;
          var caminhoFinal = `./uploads/fornecedores/${resultado.insertId}.png`;
      
          if(erro) res.send(erro)
          fs.copyFile(caminhoTemp,caminhoFinal,
          (err)=>{
            console.log(err);
          })
          res.send(resultado)
        });
      });
    
      rotas.patch('/fornecedores_byid/:id_fornecedor', (req, res) => {
        const iDfornecedor = req.params.id_fornecedor;
        var razao = req.body.razao
        var contato = req.body.contato
        var logradouro = req.body.logradouro
        var cidade = req.body.cidade
        var uf = req.body.uf
    
        var sql = `UPDATE fornecedor SET razao=?, contato=?, logradouro=?, cidade=?, uf=? WHERE id_fornecedor = ?`;
        connection.query(sql, [razao,contato,logradouro,cidade,uf,iDfornecedor], (error, result) => {
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