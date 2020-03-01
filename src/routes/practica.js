//Import modules
const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')

const mysql_connection = require('../database');

//Route /asignaturas/:asignatura_idasignatura/practicas
//Practicas GET
router.get('/asignaturas/:asignatura_idasignatura/practicas', (req, res) =>{
    var { asignatura_idasignatura } = req.params;
    mysql_connection.query('Select * from practica Where asignatura_idasignatura = ?', [asignatura_idasignatura] ,(err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/
//Practicas POST
router.post('/asignaturas/:asignatura_idasignatura/practicas', (req, res) =>{
    let enunciado;
    var nombre;
    var creacion_grupo;
    var cierre_grupo;
    var entrega_practica;

    new formidable.IncomingForm().parse(req, (err, fields, files, enunciado) => {
        if (err) {
          console.error('Error', err)
          throw err
        }
        nombre = fields.nombre;
        creacion_grupo = fields.creacion_grupo;
        cierre_grupo = fields.cierre_grupo;
        entrega_practica = fields.entrega_practica;
        personas_grupo = fields.personas_grupo
      }).on('fileBegin', (name, file) => {
        file.path = '/Users/pablochamorro/Desktop/enunciado' + Math.floor(Math.random() * 100).toString() + '.pdf'
        //console.log(file.name);
    })
    .on('file', (name, file) => {
        var stats = fs.statSync(file.path)
        var fileSizeInBytes = stats["size"]
        fs.open(file.path, 'r', function (status, fd) {
            if (status) {
                //console.log(status.message);
                return;
            }
            enunciado = new Buffer(fileSizeInBytes);
            fs.read(fd, enunciado, 0, fileSizeInBytes, 0, function (err, num) {
                //console.log(buffer);
                //console.log(req);
          })
          var { asignatura_idasignatura } = req.params;
          var values = [nombre, asignatura_idasignatura];
          var query = 'Insert Into practica ( nombre, asignatura_idasignatura,';
          var contador_parametros = 2;
          //Check optional fields
          if(creacion_grupo){
              query+= ' creacion_grupo,';
              values[contador_parametros] = creacion_grupo;
              contador_parametros++;
          }
          if(cierre_grupo){
              query+= ' cierre_grupo,';
              values[contador_parametros] = cierre_grupo;
              contador_parametros++;
          }
          if(entrega_practica){
              query+= ' entrega_practica,';
              values[contador_parametros] = entrega_practica;
              contador_parametros++;
          }
          if(personas_grupo){
            query+= ' personas_grupo,';
            values[contador_parametros] = personas_grupo;
            contador_parametros++;
        }    
          if(enunciado){
              query+= ' enunciado,';
              values[contador_parametros] = enunciado;
              contador_parametros++;
          }
          //Delete las ","
          query = query.substr(0, query.length-1);
          //Complet query
          query+= ') Values ('
          for(var i =0; i< contador_parametros; i++){
              query+=' ?,'
          }
          //Delete las ","
          query = query.substr(0, query.length-1);
          query+=')'
          mysql_connection.query(query, values, (err) =>{
              if(!err){
                  mysql_connection.query('Select * from practica where nombre =?', [nombre], (err, rows) =>{
                        if(!err){
                            idpractica = rows[0].idpractica;
                            mysql_connection.query('Select count(*) as count from alumno_has_asignatura where asignatura_idasignatura = ?', [asignatura_idasignatura], (err, rows) => {
                                if (!err){
                                  personas_asignatura = rows[0].count
                                  if (personas_asignatura % personas_grupo != 0){

                                      numero_grupos = (personas_asignatura/personas_grupo) + (personas_asignatura % personas_grupo);
                                  }
                                  else{
                                      numero_grupos = personas_asignatura/personas_grupo
                                  }
                                  for (i = 1; i<= numero_grupos; i++){
                                      mysql_connection.query('Insert into grupo (nombre, practica_idpractica) Values (?,?)', ['\'' + i + '\'', idpractica]);
                                  }
                                }
                                else{
                                    console.log(err);
                                    res.status(500).send({error: '/asignaturas/:asignatura_idasignatura/practicas'});
                                }
                            });
                            res.json(rows);
                            console.log(rows[0].idpractica);
                        }
                  });
              }
              else{
                  console.log(err);
                  res.status(400).send({error: 'Duplicate name'});
              }
          });
        });
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:idpractica
//Practica GET
router.get('/asignaturas/:asignatura_idasignatura/practicas/:idpractica', (req, res) =>{
    var { idpractica, asignatura_idasignatura} = req.params;
    mysql_connection.query('Select * from practica Where idpractica = ? And asignatura_idasignatura', [idpractica, asignatura_idasignatura], (err, rows) =>{
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:idpractica'});
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:idpractica
//Practica PUT(update practica)
router.put('/asignaturas/:asignatura_idasignatura/practicas/:idpractica', (req, res) =>{
    var { idpractica, asignatura_idasignatura } = req.params;
    var query = 'Update practica Set';
    var contador_parametros = 0;
    //Check optional fields
    if(req.body.nombre){
        query+= ' nombre = ?,';
        values[contador_parametros] = req.body.nombre;
        contador_parametros++;
    }
    if(req.body.creacion_grupo){
        query+= ' creacion_grupo = ?,';
        values[contador_parametros] = req.body.creacion_grupo;
        contador_parametros++;
    }
    if(req.body.cierre_grupo){
        query+= ' cierre_grupo = ?,';
        values[contador_parametros] = req.body.cierre_grupo;
        contador_parametros++;
    }
    if(req.body.entrega_practica){
        query+= ' entrega_practica = ?,';
        values[contador_parametros] = req.body.entrega_practica;
        contador_parametros++;
    }    
    if(req.body.enunciado){
        query+= ' enunciado = ?,';
        values[contador_parametros] = req.body.enunciado;
        contador_parametros++;
    }
    //Delete las ","
    query = query.substr(0, query.length-1);
    //Insert idpractica and asignatura_idasignatura into variable values
    values[contador_parametros++] = idpractica;
    values[contador_parametros] = asignatura_idasignatura;
    //Complet query
    query+=' Where idpractica = ? And asignatura_idasignatura = ?';
    mysql_connection.query(query, values, (err) =>{
        if(!err){
            res.json({Status: 'Practica Updated'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:idpractica'});
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:idpractica
//Practica DELETE
router.delete('/asignaturas/:asignatura_idasignatura/practicas/:idpractica', (req, res) =>{
    var { idpractica, asignatura_idasignatura } = req.params;
    mysql_connection.query('Delete from practica Where idpractica = ? And asignatura_idasignatura', [idpractica, asignatura_idasignatura], (err) =>{
        if(!err){
            res.json({Status: 'Practica Delete'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:idpractica'});
        }
    });
});

//Route /asignaturas/:asignatura_idasignatura/practicas/:idpractica/grupos
//Grupo Get
router.get('/asignaturas/:asignatura_idasignatura/practicas/:idpractica/grupos', (req, res) => {
    var { idpractica, asignatura_idasignatura } = req.params
    mysql_connection.query('Select * from grupo Where practica_idpractica = ?', [idpractica],  (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:idpractica/grupos'});
        }
    })
})
//Route /grupos_alumno
//Grupo Get
router.get('/asignaturas/:asignatura_idasignatura/practicas/:idpractica/grupos_alumno', (req, res) => {
    var { idpractica, asignatura_idasignatura } = req.params
    var query = "select alumno.nombre, (select nombre from grupo where idgrupo = alumno_has_grupo.grupo_idgrupo) as grupo from alumno inner join alumno_has_grupo on alumno.idusuario=alumno_has_grupo.alumno_idusuario where alumno_has_grupo.grupo_practica_idpractica = ?"
    mysql_connection.query(query, [idpractica],  (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:idpractica/grupos_alumno'});
        }
    })
})

//Route /asignaturas/:asignatura_idasignatura/practicas/:idpractica/grupos/pdf_grupos
//Grupo Get
router.get('/asignaturas/:asignatura_idasignatura/practicas/:idpractica/pdf_grupos', (req, res) => {
    var { idpractica, asignatura_idasignatura } = req.params
    mysql_connection.query('Select pdf_grupos from practica Where idpractica = ?', [idpractica],  (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/asignaturas/:asignatura_idasignatura/practicas/:idpractica/pdf_grupos'});
        }
    })
})

//Route /practica_grupo_alumno
//Grupo POST
router.post('/practica_grupo_alumno', (req, res) => {
    var { practicas } = req.body;
    query = "Select grupo.practica_idpractica, grupo.nombre As nombre_grupo, alumno.nombre from alumno_has_grupo join alumno on alumno_idusuario=idusuario join grupo on grupo_idgrupo=idgrupo where grupo_idgrupo in (select idgrupo from grupo where practica_idpractica in (?));";
    mysql_connection.query(query, [practicas],  (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/practica_grupo_alumno'});
        }
    })
})

//Route /practica_grupo_alumno
//Grupo POST
router.post('/grupos_por_practicas', (req, res) => {
    var { practicas } = req.body;

    mysql_connection.query("Select * from grupo where practica_idpractica in (?)", [practicas],  (err, rows)=> {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
            res.status(400).send({error: '/grupos_por_practica'});
        }
    })
})

//Route //practicas/:idpractica/delete_alumno_group'
//Delete alumno_has_group
router.delete('/practicas/:idpractica/delete_alumno_group', (req, res) => {
    var { idpractica } = req.params;
    var { grupo, idalumno} = req.body;
    query = 'Delete from alumno_has_grupo Where grupo_idgrupo = ? and alumno_idusuario = ? and grupo_practica_idpractica = ?';
    mysql_connection.query(query, [grupo, idalumno, idpractica], (err) => {
        if(!err){
            res.json({Status: 'User delete group'});
        }
        else{
            console.log(err);
            res.status(400).send({error: '/practicas/:idpractica/delete_alumno_group'});
        }
    });
})

//Route //practicas/:idpractica/insert_alumno_group'
// Insert alumno_has_group
router.post('/practicas/:idpractica/insert_alumno_group', (req, res) => {
    var { idpractica } = req.params;
    var { grupo, idalumno} = req.body;
    query = "select personas_grupo as personas_max, (select count(*) from alumno_has_grupo where grupo_idgrupo=?) as personas_grupo from practica where idpractica=?"
    mysql_connection.query(query, [grupo, idpractica], (err, rows) => {
        if(!err && rows[0].personas_grupo < rows[0].personas_max){
            query = 'Insert into alumno_has_grupo (grupo_idgrupo, alumno_idusuario, grupo_practica_idpractica) Values (?,?,?)';
            mysql_connection.query(query, [grupo, idalumno, idpractica], (err) => {
                if(!err){
                    res.json({Status: 'User insert into group'});
                }
                else{
                    console.log(err);
                    res.status(400).send({error: '/practicas/:idpractica/insert_alumno_group'});
                }
            });
        }
        else{
            console.log(err);
            res.status(400).send({error: '/practicas/:idpractica/insert_alumno_group'});
        }
    });
})


module.exports = router;