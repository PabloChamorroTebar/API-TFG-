//Import modules
const express = require('express');
const router = express.Router();
const fs = require('fs');

const mysql_connection = require('../database');

//Route /asignaturas
//Asignaturas GET
router.get('/asignaturas', (req, res) =>{
    mysql_connection.query('Select * from asignatura', (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas'})
        }
    });
});

//Route /asignaturas
//Asignaturas POST
router.post('/asignaturas', (req, res) =>{
    var { nombre } = req.body;
    mysql_connection.query('Insert Into asignatura (nombre) Values (?)', [nombre], (err) =>{
        if(!err){
            res.json({Status: 'Asignatura Saved'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas'})
        }
    });
});

//Route /asignaturas/:id
//Asigantura GET
router.get('/asignaturas/:id', (req, res) =>{
    var { id } = req.params;
    mysql_connection.query('Select * from asignatura Where idasignatura = ?', [id], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/id'})
        }
    });
});

//Route /asignaturas/:id
//Asignatura PUT(update asignatura)
router.put('/asignatura/:id', (req, res) =>{
    var { nombre } = req.body;
    var { id } = req.params;
    mysql_connection.query('Update asignatura Set nombre = ? Where idasignatura = ?', [nombre, id], (err) =>{
        if(!err){
            res.json({Status: 'Asignatura Updated'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/id'})
        }
    });
});

//Route /asignaturas/:id
//Asignatura DELETE
router.delete('/asinatura/:id', (req, res) =>{
    var { id } = req.params;
    mysql_connection.query('Delete From asignatura Where idasignatura = ?', [id], (err) =>{
        if(!err){
            res.json({Status: 'Asignatura Deleted'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/id'})
        }
    });
});

//Route /asignaturas/:id/insert_document
//Asignatura post
router.get('/asignaturas/:id/insert_document', (req, res) => {
    fs.open('/Users/pablochamorro/Documents/restful/src/routes/guia_gpti.pdf', 'r', function(err, fileToRead){
        if (!err){
            var stats = fs.statSync('/Users/pablochamorro/Documents/restful/src/routes/guia_gpti.pdf');
            var fileSizeInBytes = stats["size"];
            var buffer = new Buffer(fileSizeInBytes);
            fs.read(fileToRead, buffer, 0, fileSizeInBytes, 0);
            console.log(buffer);
        }else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:id/insert_document'});
        }
    });
});


module.exports = router;