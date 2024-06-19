//Ruta de gestión de los usuarios

//Importar modulos
const express = require('express');
const bcryptjs = require('bcryptjs');
//Requerir el fichero de conexión a base de datos situado en la carpeta data
const connection = require('../data/db.js');
const path = require('path');

//Inicializar routerBack
const routerBack = express.Router();
const { log } = require('console');

//Renderizar la ruta principal de gestión de usuarios
routerBack.get('/', (req, res) => {
    const selectAll = `SELECT * FROM residentes_aire`
    connection.query(selectAll, (err, result) => {
        if (err) throw err;
        //console.log(result);
        res.render('userList', { usuario: result });
    });
})

//Renderizar la ruta para insertar nuevos usuarios

routerBack.get('/formulario', (req, res) => {
    res.render('formBack');
})

//Renderizar la ruta para modificar los datos de los usuarios

//Insertar datos de los nuevos usuarios en la base de datos
//Encriptando la password usando bcryptjs
routerBack.post('/insert', async (req, res) => {

    try {
        const { name, apellido, tel, ciudad, email, consulado, dni, finDni, pasaporte, finPsp, password } = req.body;
        //let passHash = await bcryptjs.hash(password, 8);
        //console.log(passHash);
        const insert = `INSERT INTO residentes_aire (consulado_pertenencia,nombre_res, apellido_res, telefono_res, ciudad_aire_res, num_dni_res, fin_dni_res, num_pasaporte_res, fin_pasaporte_res, email_res, password_res) VALUES ('${consulado}','${name}','${apellido}','${tel}','${ciudad}','${dni}','${finDni}','${pasaporte}','${finPsp}','${email}','${password}');`;
        //Ejecutar la petición
        connection.query(insert, (err, result) => {
            if (err) {
                console.error('Error al insertar usuario:', err);
                return res.status(500).send('Error al insertar usuario');
            }
            //console.log(result);
            res.redirect('/');
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud');
    }
})



module.exports = routerBack;