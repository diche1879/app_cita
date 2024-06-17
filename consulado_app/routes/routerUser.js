//Rutas de usuarios

//Importar modulos
const express = require('express');
const bcryptjs = require('bcryptjs');
//Requerir el fichero de conexión a base de datos situado en la carpeta data
const jwt = require('jsonwebtoken');
const connection = require('../data/db.js');
const path = require('path');
const { error } = require('console');

//Inicializar routerUser
const routerUser = express.Router();

routerUser.get('/', (req, res) => {
    res.render('indexUser');
})

routerUser.get('/loginRes', (req, res) => {
    res.render('loginRes', { error: null, classError: '' });
})

//Login de usuario

routerUser.post('/loginRes', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        //Si no se escribe el mail o la contraseña
        if (!email || !password) {
            return res.render('loginRes', { error: 'Todos los campos son obligatorios', classError: 'error' });
        } else {
            connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
                //si no hay correspondencia de mail o password en la BD
                if (result.length == 0 || !(await bcryptjs.compare(password, result[0].password_res))) {
                    res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
                } else {
                    //Si todo está bien
                    const idUser = result[0].id_residente
                    //generamos un nuevo token en el que se incluirá el id del usuario, una palabra secreta y el tiempo de expiración del token mismo
                    const token = jwt.sign({id: idUser},process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRE })
                    //console.log(token);
                }
            })
        }


    } catch (error) {
        console.log(error);
    }
})

routerUser.get('/main', (req, res) => {
    res.render('mainUserAire');
})

module.exports = routerUser;