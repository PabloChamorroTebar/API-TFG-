//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route /invitaciones
// Post /invitaciones
router.post('/invitaciones', (req, res) => {
    var { idalumno, idgrupo, idasignatura } = req.body;
    query = 'Insert into alumno_has_grupo (alumno_idusuario, grupo_idgrupo, grupo_practica_idpractica) Values (?,?,?) ON DUPLICATE KEY UPDATE grupo_idgrupo=?';
    mysql_connection.query(query, [idalumno, idgrupo, idasignatura, idgrupo], (err) => {
        if(!err){
            res.json({Status: 'Invitacion Created or Updated'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/invitaciones/'});
        }
    });
})

//Route /invitaciones/:nombre
// Get /invitaciones/:nombre
router.get('/invitaciones/:nombre', (req, res) => {
    var { nombre } = req.params;
    query = 'select invitacion.*, practica.nombre as nombre_practica, grupo.nombre as nombre_grupo, alumno.nombre as alumno_invitante from invitacion inner join grupo on invitacion.alumno_has_grupo_grupo_idgrupo=grupo.idgrupo inner join practica on invitacion.alumno_has_grupo_grupo_practica_idpractica=practica.idpractica inner join alumno on invitacion.alumno_has_grupo_alumno_idusuario=alumno.idusuario where invitacion.alumno_invitado=?';
    mysql_connection.query(query, [nombre], (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/invitaciones/:nombre'});
        }
    });
})


//Route /invitaciones/crear_invitacion
// Get /invitaciones/crear_invitacion
router.post('/invitaciones/crear_invitacion', (req, res) => {
    var { alumno_invitado, idsuario, idgrupo, idpractica } = req.body;
    query = 'Insert into invitacion (alumno_has_grupo_alumno_idusuario, alumno_has_grupo_grupo_idgrupo, alumno_has_grupo_grupo_practica_idpractica, alumno_invitado) Values (?,?,?,?)';
    mysql_connection.query(query, [idsuario, idgrupo, idpractica, alumno_invitado], (err) => {
        if(!err){
            res.json({Status: 'Invitacion Created'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/invitaciones/crear_invitacion'});
        }
    });
})

//Route /invitaciones/:idinvitacion
// Delete /invitaciones/:idinvitacion
router.delete('/invitaciones/:idinvitacion', (req, res) => {
    var { idinvitacion } = req.params;
    query = 'Delete from invitacion where idinvitacion=?';
    mysql_connection.query(query, [idinvitacion], (err) => {
        if(!err){
            res.json({Status: 'Invitacion Delete'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/invitaciones'});
        }
    });
})

module.exports = router;