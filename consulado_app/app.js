//Requiero los modulos que necesito
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

//Ruta administradores
const routerBack = require('./routes/routerBack');

//Ruta Usuarios
const routerUser = require('./routes/routerUser');

//inicializar express
const app = express();
const appUser = express();

//configurar puertos para los dos accesos
const PORT  = process.env.PORT || 3000;
const PORT_USER  = process.env.PORT_USER || 3100;


/* ADMINISTRADORES */
//Definir motor de plantilla
app.set('view engine', 'ejs');
app.set('views', './views');
//utilizar capreta de recursos estaticos
app.use(express.static('public'));
//configurar cookie-parser
//app.use(cookieParser());
//procesar datos desde formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Rutas
app.use(routerBack);


/* USUARIOS */
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



//Inicializar Puerto
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
appUser.listen(PORT_USER, () => {
    console.log(`Servidor en: http://localhost:${PORT_USER}`);
});
