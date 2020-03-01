//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route profesores
//Profesor GET
router.get('/profesores', (req, res) => {
    mysql_connection.query('Select * from profesor', (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: 'profesor'});
        }
    });
});

//Route profesores
//Profesores POST
router.post('/profesores', (req, res) =>{
    var { nombre, email, password } = req.body;
    mysql_connection.query('Insert Into profesor (nombre, email, password) Values (?, ?, ?)', [nombre, email, password], (err) =>{
        if(!err){
            res.json({Status: 'Profesor Saved'});
        }
        else{
            console.log(err);
            res.status(400).send({error: 'profesor'});
        }
    });
});

//Route profesores/email
//Profesor GET
router.get('/profesores/:email', (req, res) =>{
    var { email } = req.params;
    mysql_connection.query('Select * from profesor Where email = ?', [email], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: 'profesor/email'});
        }
    });
});

//Route profesores/email
//Profesor PUT(update profesor)
router.put('/profesores/:email', (req, res) =>{
    var { email } = req.params;
    var query = 'Update profesor Set'
    var values = [];
    var contador_parametros = 0;
    if(req.body.nombre){
        query+= ' nombre = ?,';
        values[contador_parametros] = req.body.nombre;
        contador_parametros++;
    }
    if(req.body.email){
        query+= ' email = ?,';
        values[contador_parametros] = req.body.email;
        contador_parametros++;
    }
    if(req.body.password){
        query+= ' password = ?,';
        values[contador_parametros] = req.body.password;
        contador_parametros++;
    }
    //Delete last "," 
    query = query.substr(0, query.length-1);
    values[contador_parametros] = email;
    query+= ' Where email = ?'
    mysql_connection.query(query, values, (err) =>{
        if(!err){
            res.json({Status: 'Profesor update'});
        }
        else{
            console.log(err);
            res.status(400).send({error: 'profesor/email'});
        }
    });
});
////Route profesores/matricula
//Profesor DELETE
router.delete('/profesores/:email', (req, res) =>{
    var { email } = req.params;
    mysql_connection.query('Delete From profesor Where email = ?', [email], (err) =>{
        if(!err){
            res.json({Status: 'Profesor delete'});
            console.log(err);
        }
        else{
            console.log(err);
            res.status(400).send({error: 'profesor/email'});
        }
    });
});

module.exports = router;