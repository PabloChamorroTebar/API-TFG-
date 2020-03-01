var fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
	}
};

const express = require('express');
const router = express.Router();
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const async = require('async');
const fs = require('fs')

const mysql_connection = require('../database');

function getDoc(pdfDoc, cb) {
    // buffer the output
    var chunks = [];
    
    pdfDoc.on('data', function(chunk) {
        chunks.push(chunk);
    });
    pdfDoc.on('end', function() {
        var result = Buffer.concat(chunks);
        cb(null, result, pdfDoc._pdfMakePages);
    });
    pdfDoc.on('error', cb);
    
    // close the stream
    pdfDoc.end();
}

function insert_blob (dict_grupo, idpractica){
    //console.log(dict_grupo);
    var docDefinition = {
        content: [ 
        ],
        styles: {
            header: {
                bold: true,
                fontSize: 15
            }
        },
        defaultStyle: {
            fontSize: 12
        }
    }
    for ( var key in dict_grupo){
        /* Insertamos el header con el titulo que es el nombre del grupo */
        docDefinition['content'].push({
            text: "Grupo " +key,
            style: 'header'
        })
        for (p=0; p<dict_grupo[key].length; p++){
            var alumno = dict_grupo[key][p]['alumno_nombre'] + " " + dict_grupo[key][p]['alumno_email'] + " "+ dict_grupo[key][p]['alumno_matricula'] + " ";
            docDefinition['content'].push({
                ul: [alumno],
            })
        }
    }
    // Building the PDF
    var pdfDoc = printer.createPdfKitDocument(docDefinition);

    getDoc(pdfDoc, function (err, buffer, pages) { 
        mysql_connection.query('Update practica Set pdf_grupos = ? where idpractica = ?', [buffer, idpractica], (err) => {
        if (err){
            console.log(err);
        }
        else{
            //console.log(idpractica);
        }
        });
        /* app logic */ 
    });

}

/* Cogemos todas las asignaturas */
function create_pdfs (){
    mysql_connection.query('Select * from practica', [], (err, rows) => {
        if (!err){
            async.forEachOf(rows, function (dataElement, i, inner_callback){
                /* Comprobamos que la fecha actual es mayor que y que pdf_grupos = null */
                if ( rows[i]['cierre_grupo'] != null && new Date > rows[i]['cierre_grupo'] && rows[i]['pdf_grupos'] == null){
                    var idpractica = rows[i]['idpractica'];
                    var personas_grupo = rows[i]['personas_grupo'];
                    var alumnos_sin_grupo, grupos;
                    /* Cogemos todos los alumnos sin grupo */
                    var query = 'select alumno.nombre as alumno_nombre, alumno.email as alumno_email, alumno.matricula as alumno_matricula, alumno.idusuario as idusuario from alumno where alumno.idusuario not in (select alumno_idusuario from alumno_has_grupo where grupo_practica_idpractica = ?)';
                    mysql_connection.query(query, [idpractica], (err, rows) => {
                        if (!err){
                            alumnos_sin_grupo = [];
                            alumnos_sin_grupo_lenght = 0;
                            var dict_alumno;
                            for (var l in rows){
                                dict_alumno = {}
                                dict_alumno['alumno_nombre'] = rows[l]['alumno_nombre'] + " (AUTOMÁTICO)"
                                dict_alumno['alumno_email'] = rows[l]['alumno_email']
                                dict_alumno['alumno_matricula'] = rows[l]['alumno_matricula']
                                dict_alumno['idusuario'] = rows[l]['idusuario']
                                alumnos_sin_grupo.push(dict_alumno);
                                alumnos_sin_grupo_lenght++;
                            }
    
                            /* Cogemos todos los grupos de la practica */
                            var query = 'select nombre from grupo where practica_idpractica = ?';
                            mysql_connection.query(query, [idpractica], (err, rows) => {
                                if (!err){
                                    grupos = rows;
                                    dict_grupo = [];
                                    /* Metemos lo actual en un dict */
                                    for ( var j in grupos){
                                        dict_grupo[grupos[j]['nombre']] = []
                                    }
                                    /* Cogemos todos los alumnos en los grupos de la practica */
                                    var query = 'select alumno.nombre as alumno_nombre, alumno.email as alumno_email, alumno.matricula as alumno_matricula, grupo.nombre as grupo_nombre, grupo.idgrupo as idgrupo from alumno inner join alumno_has_grupo on alumno_has_grupo.alumno_idusuario = alumno.idusuario inner join grupo on alumno_has_grupo.grupo_idgrupo = grupo.idgrupo where grupo_practica_idpractica=?';
                                    mysql_connection.query(query, [idpractica], (err, rows) => {
                                        if (!err){
                                            grupos_alumnos = rows;

                                            /**Variable donde vamos a guardar los datos de UN alumno */
                                            var dict_alumno;
                                            /* Metemos lo actual en un dict */
                                            for ( var k in grupos_alumnos){
                                                dict_alumno = {}
                                                dict_alumno['alumno_nombre'] = grupos_alumnos[k]['alumno_nombre']
                                                dict_alumno['alumno_email'] = grupos_alumnos[k]['alumno_email']
                                                dict_alumno['alumno_matricula'] = grupos_alumnos[k]['alumno_matricula']
                                                dict_grupo[grupos_alumnos[k]['grupo_nombre']].push(dict_alumno);
                                            }
                                            /* Metemos los alumnos que faltan */
                                            for ( var key in dict_grupo){
                                                console.log(dict_grupo[key].length)
                                                alumnos_con_grupo = dict_grupo[key].length;
                                                if (alumnos_con_grupo < personas_grupo && alumnos_sin_grupo_lenght>0){
                                                    for ( alumnos_con_grupo; alumnos_con_grupo < personas_grupo && alumnos_sin_grupo_lenght > 0; alumnos_con_grupo++){
                                                        query='Insert into alumno_has_grupo (alumno_idusuario, grupo_idgrupo, grupo_practica_idpractica) Values (?, (Select idgrupo from grupo where nombre=? and practica_idpractica=?), ?)';
                                                        mysql_connection.query(query, [alumnos_sin_grupo[0]['idusuario'],key,idpractica,idpractica], (err) =>{
                                                            if(err){
                                                                console.log(err);
                                                            }
                                                        })
                                                        dict_grupo[key].push(alumnos_sin_grupo[0]);
                                                        alumnos_sin_grupo.splice(0,1);
                                                        alumnos_sin_grupo_lenght--;
                                                    }
                                                }
                                            }
                                            insert_blob(dict_grupo, idpractica);
                                            inner_callback(null);
                                        }
                                        else{
                                            console.log(err);
                                            inner_callback(err);
                                        }
                                    });
                                }
                                else{
                                    console.log(err);
                                    inner_callback(err);
                                }
                            });
                        }
                        else{
                            console.log(err);
                            inner_callback(err);
                        }
                    });
                }
            });
        }
    });
}


/* Darle un tiempo maximo y cerrarlo*/
create_pdfs();