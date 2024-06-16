//Rutas de usuarios

//Importar modulos
const express = require('express');
const bcryptjs = require('bcryptjs');
//Requerir el fichero de conexión a base de datos situado en la carpeta data
const connection = require('../data/db.js');
const path = require('path');

//Inicializar routerUser
const routerUser = express.Router();

routerUser.get('/',(req, res) => {
    res.render('indexUser');
})

routerUser.get('/loginRes',(req, res) => {
    res.render('loginRes');
})

routerUser.get('/main',(req, res) => {
    res.render('mainUserAire');
})

module.exports = routerUser;