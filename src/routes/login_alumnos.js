//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route login_alumnos
//Login POST
router.post('/login_alumnos', (req, res) =>{
    var { email_matricula } = req.body;
    mysql_connection.query('Select * from alumno Where email = ? Or matricula = ?', [email_matricula, email_matricula], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/login_alumnos'});
        }
    });
});

module.exports = router;