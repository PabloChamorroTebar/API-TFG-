/**
 * Notas:
 * Borrar comentarios en español y borrar morgan que solo sirver para ver las llamadas por la consola
 */
//Import modules
const express = require('express');
const morgan = require('morgan');
const body_parser = require('body-parser');

//Server variable
const server = express();

//Middlewares
server.use(morgan('dev'));
server.use(express('json'));
server.use(body_parser.json());

//Routes
server.use(require('./routes/alumnos'));
server.use(require('./routes/profesor'));
server.use(require('./routes/asignatura'))
server.use(require('./routes/practica'));
server.use(require('./routes/grupos'));
server.use(require('./routes/login_alumnos'));
server.use(require('./routes/asignaturas_alumno'));
server.use(require('./routes/practicas_alumno'));
server.use(require('./routes/invitaciones'))

server.use(require('./routes/login_profesores'));
server.use(require('./routes/asignaturas_profesor'));
server.use(require('./routes/practicas_profesor'));

//Settings
server.set('port', process.env.PORT || 3000);

//Ponemos el servidor a escuchar en el 3000 y cuando se ponga a escuchar nos sale el mensaje de la función
//Start server
server.listen(server.get('port'), () => {
    console.log('Server on port %d', server.get('port'));
});