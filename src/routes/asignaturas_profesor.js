//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route /asignatura_profesor/:idprofesor
//Asignaturas_profesor/:idprofesor GET
router.get('/asignaturas_profesor/:profesor', (req, res) =>{
    var { profesor } = req.params;
    var query = "select * from asignatura where idasignatura in (select asignatura_idasignatura from profesor_has_asignatura where profesor_idprofesor=?);"
    mysql_connection.query(query, [profesor], (err, rows) =>{
        if(!err){
            console.log(rows)
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas_profesor/:profesor'});
        }
    });
});

module.exports = router;