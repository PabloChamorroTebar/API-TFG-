//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route /asignatura_alumno/:idalumno
//Asignaturas_alumno/:idalumno GET
router.get('/asignaturas_alumno/:idalumno', (req, res) =>{
    var { idalumno } = req.params;
    var query = "select * from asignatura where idasignatura in (select asignatura_idasignatura from alumno_has_asignatura where usuario_idusuario=?);"
    mysql_connection.query(query, [idalumno], (err, rows) =>{
        if(!err){
            for( var i = 0; i< rows.length; i++){
                if (rows[i].guia_docente != null){
                    rows[i].guia_docente = rows[i].guia_docente.toString('binary');
                }
            }
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas_alumno/:idalumno'});
        }
    });
});

module.exports = router;