//Import modules
const express = require('express');
const router = express.Router();

const mysql_connection = require('../database');

//Route login_profesores
//Login POST
router.post('/login_profesores', (req, res) =>{
    var { email } = req.body;
    console.log(email);
    mysql_connection.query('Select * from profesor Where email = ?', [email], (err, rows) =>{
        if(!err){
            console.log(rows)
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/login_profesores'});
        }
    });
});

module.exports = router;