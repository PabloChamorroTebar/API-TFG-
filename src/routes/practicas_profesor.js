//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route /profesores/:idprofesor/practicas_profesor
//profesores/:idprofesor/practicas_profesor GET
router.get('/profesores/:idprofesor/practicas_profesor', (req, res) =>{
    var { idprofesor } = req.params;
    var query = 'select * from practica where asignatura_idasignatura in (Select asignatura_idasignatura from profesor_has_asignatura where profesor_idprofesor=?);'
    mysql_connection.query(query, [idprofesor], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/profesores/:idprofesor/practicas_profesor'});
        }
    });
});

module.exports = router;