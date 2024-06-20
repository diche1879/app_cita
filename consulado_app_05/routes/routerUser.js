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

/* RUTA PRINCIAL */
routerUser.get('/', (req, res) => {
    res.render('indexUser',{span:'perfil', button:'', mensaje:''});
})

/* ACCESO AL LOGIN */
routerUser.get('/loginRes', (req, res) => {
    res.render('loginRes', { error: null, classError: '',span:'perfil', button:'' , mensaje:''});
})

/* LOGIN DE USUARIO */

routerUser.post('/loginRes', (req, res) => {
    //Obtener datos desde el body
    const email = req.body.email;
    const password = req.body.password;

    //Si no se proporcionan el mail o la contraseña devolver un mensaje de error
    if (!email || !password) {
        return res.render('loginRes', { error: 'Todos los campos son obligatorios', classError: 'error' , mensaje:''});
    }

    //Si se proporciona todo verificar si existe el usuario
    connection.query('SELECT * FROM residentes_aire WHERE email_res = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error', span:'perfil', button:'', mensaje:''});
        }
        //si no existe devolver un mensaje de usuario no encontrado
        if (result.length === 0) {
            //console.log("Usuario no encontrado");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error', span:'perfil', button:'', mensaje:'' });
        }
        //Guardar el primer usuario encontrado en una variable
        const user = result[0];
        console.log("Usuario encontrado:", user);

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        if (password !== user.password_res) {
            console.log("Contraseña incorrecta");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error', span:'perfil', button:'', mensaje:user.alerta});
        }

        // Si las credenciales son válidas, generar token JWT y configurar las caracteristicas
        const idUser = user.id_residente;
        const token = jwt.sign({ id: idUser }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRE });
        //Configurar la cookies
        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        //proporcionar la cookiec, primer parametro: nombre cookie, segundo: el token generado, tercero: la caracteristicas de la cookie
        res.cookie('jwt', token, cookiesOptions);

        // acceder a la página inicial del perfil de usuario
        res.render('mainUserAire', { user, span:user.nombre_res, button:'Mensajes', mensaje:user.alerta });

    });
});

/* RUTA PARA MOSTRAR DATOS DE USUARIO*/
routerUser.get('/user/:id', (req, res) => {
    const idUser = req.params.id;
    const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ${idUser}`;
    connection.query(selectUser, (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
        }
        if (result.length === 0) {
            console.log("Usuario no encontrado");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
        }
        const user = result[0];
        console.log("Usuario encontrado:", user);
        res.render('userDates', { user, span:user.nombre_res, button:'Mensajes', mensaje:user.alerta});
    })
})

//Mostrar calendario citas
routerUser.get('/calendario/:id', (req, res) => {
    const idUser = req.params.id;
    const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ${idUser}`;
    connection.query(selectUser, (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
        }
        if (result.length === 0) {
            console.log("Usuario no encontrado");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
        }
        const user = result[0];
        console.log("Usuario encontrado:", user);
        res.render('calendarioAuto', {user, span:user.nombre_res, button:'Mensajes', mensaje:user.alerta});
    })
    
})



module.exports = routerUser;