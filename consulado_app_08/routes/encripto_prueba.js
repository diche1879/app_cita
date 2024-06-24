/* routerUser.post('/loginRes', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log("Constantes:", email, password);

        // Si no se escribe el email o la contraseña
        if (!email || !password) {
            return res.render('loginRes', { error: 'Todos los campos son obligatorios', classError: 'error' });
        }

        // Consulta a la base de datos
        connection.query('SELECT * FROM residentes_aire WHERE email_res = ?', [email], async (err, result) => {
            console.log("Resultado de la consulta:", result);
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
            }

            // Verificación de usuario
            if (!result || result.length == 0) {
                console.log("Usuario no encontrado");
                return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
            }

            // Verificación de la contraseña
            const user = result[0];
            console.log("Contraseña del usuario:", user.password_res);
            const passwordMatches = await bcryptjs.compare(password, user.password_res);
            console.log("Comparación de contraseñas:", passwordMatches);

            if (!passwordMatches) {
                console.log("Contraseña incorrecta");
                return res.render('loginRes', { error: 'Usuario o contraseña incorrectos', classError: 'error' });
            }

            // Si todo está bien
            const idUser = user.id_residente;
            console.log('ID del usuario:', idUser);
            const token = jwt.sign({ id: idUser }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRE });
            console.log("Token:", token);

            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie('jwt', token, cookiesOptions);
            res.render('mainUserAire', { usuario: user });
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).render('loginRes', { error: 'Error en el servidor', classError: 'error' });
    }
}); */


/* routerUser.get('/main', (req, res) => {
    res.render('mainUserAire');
}) */


    /* function redirectToMainUserAire(res, userId) {
    connection.query('SELECT * FROM residentes_aire WHERE id_residente = ?', [userId], (err, userResult) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }

        if (userResult.length === 0) {
            console.log("Usuario no encontrado");
            return res.status(404).send('Usuario no encontrado');
        }

        const user = userResult[0];

        connection.query('SELECT * FROM cita_dni_res WHERE id_residente = ?', [userId], (err, citasResult) => {
            if (err) {
                console.error('Error al obtener las citas del usuario:', err);
                return res.status(500).send('Error en el servidor');
            }

            const citas = citasResult;

            // Renderizar la página principal del usuario con los datos actualizados
            res.render('mainUserAire', { user, span: user.nombre_res, button: 'Mensajes', mensaje: user.alerta, citas: citas });
        });
    });
} */
/*  function redirectToPreviousPage(req, res) {
     const referer = req.headers.referer;
     if (referer) {
         res.redirect(referer);
     } else {
         // Si no hay Referer, redirige a una página por defecto
         res.redirect('/'); // Puedes ajustar esta URL según tu aplicación
     }
 } */