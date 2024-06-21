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
    res.render('indexUser', { span: 'perfil', button: '', mensaje: '', citas: '' });
})

/* ACCESO AL LOGIN */
routerUser.get('/loginRes', (req, res) => {
    res.render('loginRes', { error: null, classError: '', span: 'perfil', button: '', mensaje: '', citas: '' });
})

/* LOGIN DE USUARIO */

routerUser.post('/loginRes', (req, res) => {
    //Obtener datos desde el body
    const email = req.body.email;
    const password = req.body.password;

    //Si no se proporcionan el mail o la contraseña devolver un mensaje de error
    if (!email || !password) {
        return res.render('loginRes', { error: 'Todos los campos son obligatorios', classError: 'error', mensaje: '', citas: '' });
    }

    //Si se proporciona todo verificar si existe el usuario
    connection.query('SELECT * FROM residentes_aire WHERE email_res = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error', span: 'perfil', button: '', mensaje: '', citas: '' });
        }
        //si no existe devolver un mensaje de usuario no encontrado
        if (result.length === 0) {
            //console.log("Usuario no encontrado");
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error', span: 'perfil', button: '', mensaje: '', citas: '' });
        }
        //Guardar el primer usuario encontrado en una variable
        const user = result[0];
        console.log("Usuario encontrado:", user);

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        if (password !== user.password_res) {
            console.log("Contraseña incorrecta");
            //Notificar error
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error', span: 'perfil', button: '', mensaje: '', citas: '' });
        }

        //Realizar una segunda consulta para ver si el usuario tiene cita agendandas o a confirmar  
        connection.query('SELECT * FROM cita_dni_res WHERE id_residente = ? ', [user.id_residente], (err, citaResult) => {
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error', span: 'perfil', button: '', mensaje: '' });
            }
            //Guardar las citas en una constante
            const citas = citaResult;
            //console.log("CITAS", citas);

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
            res.render('mainUserAire', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citas });
        });
    });
});


/* RUTA ACEPTAR CITA AUTOMATIZADA */
routerUser.post('/aceptarCita/:id', (req, res) => {
    //recuperar el id de la cita desde el parametro de la url y el id de usuario desde el formulario
    const idCita = req.params.id;
    const userId = req.body.user_id;

    // Actualizar el estado de la cita a "confirmada"
    connection.query('UPDATE cita_dni_res SET estado_cita = ? WHERE id_cita_res = ?', ['confirmada', idCita], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado de la cita:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Redirigir a mainUserAire después de aceptar la cita
        res.redirect(`/mainUserAire/${userId}`);
    });
});

/* RUTA RECHAZAR CITA AUTOMATIZADA */
routerUser.post('/rechazarCita/:id', (req, res) => {
    const idCita = req.params.id;
    const userId = req.body.user_id;

    // Eliminar la cita de la tabla cita_dni_res
    connection.query('DELETE FROM cita_dni_res WHERE id_cita_res = ?', [idCita], (err, result) => {
        if (err) {
            console.error('Error al eliminar la cita de la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Redirigir a mainUserAire después de rechazar la cita
        res.redirect(`/mainUserAire/${userId}`);
    });
});

//Función que busca cita de usuarios a la base de datos para luego poder utilizarla en las otras rutas
function buscarCitasUsuario(userId, callback) {
    const selectCitas = 'SELECT * FROM cita_dni_res WHERE id_residente = ?';
    connection.query(selectCitas, [userId], (err, citasResult) => {
        if (err) {
            console.error('Error al obtener las citas del usuario:', err);
            return callback(err, null);
        }

        callback(null, citasResult);
    });
}

/* RUTA PARA MOSTRAR DATOS DE USUARIO*/

routerUser.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    buscarCitasUsuario(userId, (err, citasResult) => {
        if (err) {
            console.error('Error al buscar las citas del usuario:', err);
            return res.status(500).send('Error en el servidor');
        }

        const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ${userId}`;
        connection.query(selectUser, (err, result) => {
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).send('Error en el servidor');
            }

            if (result.length === 0) {
                console.log("Usuario no encontrado");
                return res.status(500).send('Usuario no encontrado');
            }

            const user = result[0];
            console.log("Usuario encontrado:", user);

            res.render('userDates', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citasResult || [] });
        });
    });
});

/* RUTA PARA MODFICAR DATOS DE USUARIO */
routerUser.get('/modificarDatos/:id', (req, res) => {
    const userId = req.params.id;

    buscarCitasUsuario(userId, (err, citasResult) => {
        if (err) {
            console.error('Error al buscar las citas del usuario:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
        }
        if (err) {
            console.error('Error al buscar las citas del usuario:', err);
            return res.status(500).send('Error en el servidor');
        }

        const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ${userId}`;
        connection.query(selectUser, (err, result) => {
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).send('Error en el servidor');
            }

            if (result.length === 0) {
                console.log("Usuario no encontrado");
                return res.status(500).send('Usuario no encontrado');
            }

            const user = result[0];
            console.log("Usuario encontrado:", user);

            res.render('modiDates', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citasResult || [] });
        });
    })
    
})


//Mostrar calendario citas

routerUser.get('/calendario/:id', (req, res) => {
    const userId = req.params.id;

    buscarCitasUsuario(userId, (err, citasResult) => {
        if (err) {
            console.error('Error al buscar las citas del usuario:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
        }

        const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ${userId}`;
        connection.query(selectUser, (err, result) => {
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
            }

            if (result.length === 0) {
                console.log("Usuario no encontrado");
                return res.render('loginRes', { error: 'Usuario no encontrado', classError: 'error' });
            }

            const user = result[0];
            console.log("Usuario encontrado:", user);

            res.render('calendarioAuto', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citasResult || [] });
        });
    });
});


// RUTA PARA CERRAR SESIÓN
routerUser.get('/logout', (req, res) => {
    // Eliminar la cookie
    res.clearCookie('jwt');
    // Redirigir al usuario a la página de inicio de sesión u otra página deseada
    res.redirect('/');
});
module.exports = routerUser;