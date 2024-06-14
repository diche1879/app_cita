const express = require('express');
const bcryptjs = require('bcryptjs');
const routerBack = express.Router();
//Requerir el fichero de conexión a base de datos situado en la carpeta data
const connection = require('../data/db.js');
const path = require('path');
const { log } = require('console');

routerBack.get('/',(req, res) => {
    res.render('indexBack');
})

routerBack.post('/insert',(req, res) => {
   const{name, apellido, tel, ciudad, email, consulado, dni, finDni, pasaporte, finPsp, password} = req.body;
   //console.log(name, apellido, tel, ciudad, email, consulado, dni, finDni, pasaporte, finPsp, password);
   let passHash = bcryptjs.hash(password, 8);
   //console.log(passHash);
   
})

module.exports = routerBack;