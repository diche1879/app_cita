//Requiero los modulos que necesito
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const connection = require('./data/db.js');
const verificaFechas = require('./functions/verificaFechas')

//Ruta administradores
const routerBack = require('./routes/routerBack.js');

//Ruta Usuarios
const routerUser = require('./routes/routerUser.js');

//inicializar express
const app = express();
const appUser = express();

//configurar puertos para los dos accesos
const PORT = process.env.PORT || 3000;
const PORT_USER = process.env.PORT_USER || 3100;


/* ADMINISTRADORES */
//Definir motor de plantilla
app.set('view engine', 'ejs');
app.set('views', './views');
//utilizar capreta de recursos estaticos
app.use(express.static('public'));
//configurar cookie-parser
app.use(cookieParser());
//procesar datos desde formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Rutas
app.use(routerBack);


/* USUARIOS */
//Volver atrás
appUser.use((req, res, next) => {
    res.locals.previousUrl = req.headers.referer || '/';
    // Valor predeterminado si no hay página anterior
    next();
});
//Definir motor de plantilla
appUser.set('view engine', 'ejs');
appUser.set('views', './views');
//utilizar capreta de recursos estaticos
appUser.use(express.static('public'));
//configurar cookie-parser
//app.use(cookieParser());
//procesar datos desde formulario
appUser.use(express.urlencoded({ extended: true }));
appUser.use(express.json());
//Rutas
appUser.use(routerUser);

/* FUNCIÓN PARA VERIFICAR LAS FECHAS DE CADUCIDADS Y ACTUALIZAR EL MENSAJE DE ALERTA */
verificaFechas();


/* PROGRAMAR LA VERIFICACIÓN CADA DÍA A LAS 6:00 CON CRON*/
//Comentada para que la función se ejecute en cuanto se connecte a la base de datos para poder verificar que funcione en cualquier momento

//Establece la hora en la que se llamará la función
/* cron.schedule('0 6 * * *', () => {
    console.log('Verificando fechas 6:00 AM');
    //Llamada a la función
    verificaFechas();
}, {
    //Indica que la tarea está programada para ejecutarse
    scheduled: true,
    //Ajusta la zona horaria
    timezone: 'Europe/Madrid'
}); */


//Inicializar Puertos
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
appUser.listen(PORT_USER, () => {
    console.log(`Servidor en: http://localhost:${PORT_USER}`);
});
