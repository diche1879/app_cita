//Rutas de usuarios

//Importar modulos
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Requerir el fichero de conexión a base de datos situado en la carpeta data
const connection = require('../data/db.js');
const fs = require('node:fs');
const {upload} = require('../functions/multerPadron');
const path = require('path');

//Inicializar routerUser
const routerUser = express.Router();

/* FUNCIÓN PARA VERIFICAR EL TOKEN */
function verifyToken(req, res, next) {
    const token = req.cookies.jwt;

    console.log('Token recibido:', token);
    if (!token) {
        return res.status(403).render('loginRes', { error: 'Login no efectuado correctamente', classError: '', span: 'perfil', button: '', mensaje: '', citas: '' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETO);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).render('loginRes', { error: 'Login no efectuado correctamente', classError: '', span: 'perfil', button: '', mensaje: '', citas: '' });
    }
}

/* FUNCIÓN PARA BUSCAR CITAS DE USUARIOS */
function buscarCitasUsuario(userId, callback) {
    const selectCitas = 'SELECT * FROM cita_dni_res WHERE id_residente = ?';
    connection.query(selectCitas, [userId], (err, citasResult) => {
        if (err) {
            console.error('Error al obtener las citas del usuario:', err);
            return callback(err, null);
        }

        callback(null, citasResult);
    });
};

/* RUTA PRINCIAL */
routerUser.get('/', (req, res) => {
    res.render('indexUser', { span: 'perfil', button: '', mensaje: '', citas: '' });
})

/* ACCESO AL LOGIN */
routerUser.get('/loginRes', (req, res) => {
    res.render('loginRes', { error: null, classError: '', span: 'perfil', button: '', mensaje: '', citas: '' });
})

/* LOGIN DE USUARIO */
routerUser.post('/loginResAuth', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.render('loginRes', { error: 'Todos los campos son obligatorios', classError: 'error', mensaje: '', citas: '' });
    }

    connection.query('SELECT * FROM residentes_aire WHERE email_res = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error', span: 'perfil', button: '', mensaje: '', citas: '' });
        }

        if (result.length === 0) {
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error', span: 'perfil', button: '', mensaje: '', citas: '' });
        }

        const user = result[0];

        // Comparar la contraseña (deberías usar bcryptjs o método seguro)
        if (password !== user.password_res) {
            return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error', span: 'perfil', button: '', mensaje: '', citas: '' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.id_residente }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRE });

        // Configurar opciones de la cookie
        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // Establecer la cookie en la respuesta
        res.cookie('jwt', token, cookiesOptions);

        // Redirigir al usuario después de iniciar sesión
        res.redirect('/userPage');
    });
});


/* RUTA USUARIO VERIFICADO */

routerUser.get('/userPage', verifyToken, (req, res) => {
    //Obtener el id del usuario desde la cookie
    const userId = req.userId;
    //console.log("ID USUARIO", userId);
    
    //Obtener los datos de usuario
    connection.query('SELECT * FROM residentes_aire WHERE id_residente = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).render('loginRes', { error: 'Error en el servidor', span: 'perfil', button: '', mensaje: '', citas: '' });
        }

        if(result.length === 0) {
            return res.status(404).render('loginRes', { error: 'Usuario no encontrado', span: 'perfil', button: '', mensaje: '', citas: '' });
        }
        //Guardar los datos del usuario en una constante
        const user = result[0];
        //console.log("USUARIO", user);

        //Obtener citas 
        connection.query('SELECT * FROM cita_dni_res WHERE id_residente = ?', [user.id_residente], (err, citaResult) =>{
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).render('loginRes', { error: 'Error en el servidor', span: 'perfil', button: '', mensaje: '', citas: '' });
            }
            //Guardar las citas en una constante
            const citas = citaResult;
            //console.log("CITAS", citas);
            res.render('mainUserAire', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citas });
        })
    })
})

/* RUTA ACEPTAR CITA AUTOMATIZADA */
routerUser.post('/aceptarCita/:id', verifyToken, (req, res) => {
    //recuperar el id de la cita desde el parametro de la url y el id de usuario desde el formulario
    const idCita = req.params.id;
    //const userId = req.body.user_id;
    const userId = req.userId

    // Actualizar el estado de la cita a "confirmada"
    connection.query('UPDATE cita_dni_res SET estado_cita = ? WHERE id_cita_res = ?', ['confirmada', idCita], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado de la cita:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Redirigir a mainUserAire después de aceptar la cita
        res.redirect(`/userPage`);
    });
});

/* RUTA RECHAZAR CITA AUTOMATIZADA */
routerUser.post('/rechazarCita/:id', verifyToken, (req, res) => {
    const idCita = req.params.id;
    const userId = req.userId

    // Eliminar la cita de la tabla cita_dni_res
    connection.query('DELETE FROM cita_dni_res WHERE id_cita_res = ?', [idCita], (err, result) => {
        if (err) {
            console.error('Error al eliminar la cita de la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Redirigir a mainUserAire después de rechazar la cita
        res.redirect(`/userPage`);
    });
});



/* RUTA PARA MOSTRAR DATOS DE USUARIO*/

routerUser.get('/user', verifyToken, (req, res) => {
    const userId = req.userId;

    buscarCitasUsuario(userId, (err, citasResult) => {
        if (err) {
            console.error('Error al buscar las citas del usuario:', err);
            return res.status(500).send('Error en el servidor');
        }

        const selectUser = `SELECT * FROM residentes_aire WHERE id_residente = ?`;
        connection.query(selectUser, [userId], (err, result) => {
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
routerUser.get('/modificarDatos', verifyToken, (req, res) => {
    const userId = req.userId;

    buscarCitasUsuario(userId, (err, citasResult) => {
        if (err) {
            console.error('Error al buscar las citas del usuario:', err);
            return res.status(500).send('Error en el servidor');
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
                return res.status(404).send('Usuario no encontrado');
            }

            const user = result[0];
            console.log("Usuario encontrado:", user);

            res.render('modiDates', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citasResult || [] });
        });
    })
    
});

/* PETICIÓN MODIFICAR DIRECCIÓN USUARIO */

routerUser.post('/modificandoDatos', verifyToken, upload.single('file'), (req, res) => {
    //recupero el id del token
    const userId = req.userId;
    //recuperar el file desde upload
    const file = req.file;
    console.log('Archivo subido:', file);

    if(!file){
        console.error('No se ha subido ningún archivo');
        return res.status(400).send('No se ha subido ningún archivo o el tipo de archivo no es valido');
    }

    try {
        //La ruta completa, está configurada por Multer
        const filePath = file.path;
        //basename es un metodo de path que nos devuelve solo el ultimo componente de la ruta, en este caso el nombre del archivo
        const fileRef = path.basename(filePath);

        //Leer el contenido del archivo antes de subirlo a la base de datos
        //Posteriores verificaciones
        /* const archivoSubido = fs.readFileSync(filePath); */

        //Insertar datos en la tabla
        const insertPeticion = `INSERT INTO peticion_modifica (id_residente, ref_file) VALUES (?,?)`;
        connection.query(insertPeticion, [userId, fileRef], (err, result) => {
            if (err) {
                console.error('Error enviar la petición a la base de datos:', err);
                return res.status(500).send('Error enviar la petición a la base de datos');
            }

            /* res.send('Petición enviada correctamente. Si todo es correcto sus datos se actualizarán en el plazo maximo de 15 días laborables (Lun-Vie') */
            res.redirect('/modificarDatos');
        })
    } catch (error) {
        console.error('Error al procesar el archivo', error);
        return res.status(500).send('Error al procesar el archivo');
    }
});


//Mostrar calendario citas

routerUser.get('/calendario', verifyToken, (req, res) => {
    const userId = req.userId;

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
routerUser.get('/logout', verifyToken, (req, res) => {
    // Eliminar la cookie
    res.clearCookie('jwt');
    // Redirigir al usuario a la página de inicio de sesión u otra página deseada
    res.redirect('/');
});
module.exports = routerUser;