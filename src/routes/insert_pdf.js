//Import modules
const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')


const mysql_connection = require('../database');

if (process.argv[2] == null || process.argv[3] == null){
    console.log("Not arguments")
    return
}

var asignatura = process.argv[2]
var file_path = process.argv[3]
var stats = fs.statSync(file_path)
var fileSizeInBytes = stats["size"]
fs.open(file_path, 'r',function (status, fd) {
    if (status) {
    return;
    }
    enunciado = new Buffer(fileSizeInBytes);
    /*fs.read(fd, enunciado, 0, fileSizeInBytes, 0, function (err, num) {
    });*/

    fs.readFile(file_path, 'binary', (err, buf) => enunciado = Buffer);
    enunciado = new Buffer(fs.readFileSync(file_path, 'binary'),'binary');
    console.log("asdasda "+enunciado.byteLength + "  y tamaño"+ fileSizeInBytes);

    query = 'Update asignatura Set guia_docente = ? Where nombre = ?'
    mysql_connection.query(query, [enunciado, asignatura], (err) =>{
        if (!err){
            console.log('Se ha insertado correctamente');
            return;
        }
        else{
            console.log(err);
            return;
        }
    });
});
return