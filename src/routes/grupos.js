//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route /asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos
//Grupos GET
router.get('/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos', (req, res) =>{
    var { practica_idpractica } = req.params;
    mysql_connection.query('Select * from grupo Where practica_idpractica = ?', [practica_idpractica], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos'});
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos
//Grupos POST
router.post('/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos', (req, res) =>{
    var { practica_idpractica } = req.params;
    var nombre = req.body.nombre;
        mysql_connection.query('Insert Into grupo (nombre, practica_idpractica) Values (?, ?)', [nombre, practica_idpractica], (err) =>{
            if(!err){
                res.json({Status: 'Grupo saved'});
            }
            else{
                console.log(err);
                res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos'});
            }
        });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/:idgrupo
//Grupo GET
router.get('/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/:idgrupo', (req, res) =>{
    var {idgrupo, practica_idpractica } = req.params;
    mysql_connection('Select * from grupo Where practica_idpractica = ? And idgrupo = ?', [practica_idpractica, idgrupo], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/idgrupo'});
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/:idgrupo
//Grupo PUT(update grupo)
router.put('/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/:idgrupo', (req, res) =>{
    var {idgrupo, practica_idpractica } = req.params;
    if(req.body.idgrupo){
        mysql_connection.query('Update grupo Set nombre = ? Where practica_idpractica = ? And idgrupo = ?', [practica_idpractica, idgrupo], (err) =>{
            if(!err){
                res.json({Status: 'Grupo updated'});
            }
            else{
                console.log(err);
                res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/idgrupo'});
            }
        });
    }
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/:idgrupo
//Grupo Delete
router.delete('/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/:idgrupo', (req, res) =>{
    var {idgrupo, practica_idpractica } = req.params;
    mysql_connection.query('Delete from grupo Where practica_idpractica = ? And idgrupo = ?', [practica_idpractica, idgrupo], (err) =>{
        if(!err){
            res.json({Status: 'Grupo Delete'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/idgrupo'});
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos_texto_plano
//Grupo Get
router.get('/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos_texto_plano', (req, res) =>{
    var { practica_idpractica } = req.params;
    query='select grupo.nombre as nombre_grupo, alumno.nombre, alumno.email, alumno.matricula, grupo.practica_idpractica from alumno_has_grupo inner join alumno on alumno_has_grupo.alumno_idusuario=alumno.idusuario inner join grupo on alumno_has_grupo.grupo_idgrupo=grupo.idgrupo where grupo_practica_idpractica=?';
    mysql_connection.query(query, [practica_idpractica], (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:practica_idpractica/grupos/idgrupo'});
        }
    });

});

module.exports = router;