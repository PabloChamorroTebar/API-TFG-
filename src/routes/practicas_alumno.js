//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route /asignatura_alumno/:idalumno
//Asignaturas_alumno/:idalumno GET
router.get('/alumnos/:idalumno/practicas_alumno', (req, res) =>{
    var { idalumno } = req.params;
    var query = "Select * from practica where asignatura_idasignatura = (select idasignatura from asignatura inner join alumno_has_asignatura on alumno_has_asignatura.asignatura_idasignatura = asignatura.idasignatura Where alumno_has_asignatura.usuario_idusuario = ?);"
    mysql_connection.query(query, [idalumno], (err, rows) =>{
        if(!err){
            for( var i = 0; i< rows.length; i++){
                rows[i].enunciado = rows[i].enunciado.toString('binary');
            }
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/alumnos/:idalumno/practicas_alumno'});
        }
    });
});

//Route //practicas/:idpractica/alumnos'
// Get alumnos per group
router.post('/practicas/:idpractica/alumnos', (req, res) => {
    var { idpractica } = req.params;
    var { nombre} = req.body;
    query = 'select alumno.nombre from alumno_has_asignatura inner join alumno on alumno_has_asignatura.usuario_idusuario=alumno.idusuario inner join asignatura on alumno_has_asignatura.asignatura_idasignatura=asignatura.idasignatura where asignatura.idasignatura=(select asignatura_idasignatura from practica where idpractica=?) and alumno.nombre!=?';
    mysql_connection.query(query, [idpractica, nombre], (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/practicas/:idpractica/insert_alumno_group'});
        }
    });
})

module.exports = router;
