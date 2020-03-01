//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route alumnos
//Alumnos GET
router.get('/alumnos', (req, res) => {
    mysql_connection.query('Select * from alumno', (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos'});
        }
    });
});

//Route alumnos
//Alumnos POST
router.post('/alumnos', (req, res) =>{
    var { nombre, email, matricula, password } = req.body;
    mysql_connection.query('Insert Into alumno (nombre, email, matricula, password) Values (?, ?, ?, ?)', [nombre, email, matricula, password], (err) =>{
        if(!err){
            res.json({Status: 'Alumno Saved'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos'});
        }
    });
});

//Route alumnos/matricula
//Alumno GET
router.get('/alumnos/:matricula', (req, res) =>{
    var { matricula } = req.params;
    mysql_connection.query('Select * from alumno Where matricula = ?', [matricula], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos/matricula'});
        }
    });
});

//Route alumnos/matricula
//Alumno PUT(update alumnos)
router.put('/alumnos/:matricula', (req, res) =>{
    var { matricula } = req.params;
    var query = 'Update alumno Set'
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
    values[contador_parametros] = matricula;
    query+= ' Where matricula = ?'
    mysql_connection.query(query, values, (err) =>{
        if(!err){
            res.json({Status: 'Alumno update'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos/matricula'});
        }
    });
});

////Route alumnos/matricula
//Alumno DELETE
router.delete('/alumnos/:matricula', (req, res) =>{
    var { matricula } = req.params;
    mysql_connection.query('Delete From alumno Where matricula = ?', [matricula], (err) =>{
        if(!err){
            res.json({Status: 'Alumno delete'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos/matricula'});
        }
    });
});

//Route /alumnos/:idalumno/change_password
//PUT /alumnos/:idalumno/
router.put('/alumnos/:idalumno/change_password', (req,res) => {
    var { idalumno } = req.params;
    var query = 'Update alumno Set password = ? Where idusuario = ?'
    var values = [req.body.password, idalumno];
    mysql_connection.query(query, values, (err) => {
        if(!err){
            console.log(idalumno+ " and " + req.body.password)
            res.json({Status: 'Password changed'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos/:idalumno/change_password'});
        }
    });
});

module.exports = router;