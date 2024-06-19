//Requiero los modulos que necesito
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const connection = require('./data/db.js');

//Ruta administradores
const routerBack = require('./routes/routerBack');

//Ruta Usuarios
const routerUser = require('./routes/routerUser');

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
function verificaFechas() {
    const selectCitas = 'SELECT id_residente, nombre_res, apellido_res, fin_dni_res, fin_pasaporte_res FROM residentes_aire';
    connection.query(selectCitas, (err, results) => {
        console.log(results);
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return;
        }

        //recorrer los datos que recuperamos en la base de datos
        results.forEach(residente => {
            //Crear un array donde almacenar los mensajes
            let alertMessage = [];
            
            let dniCaducidad = new Date(residente.fin_dni_res);
            if (tresMesesAntes(dniCaducidad)) {
                alertMessage.push(`Tu DNI caducará el ${dniCaducidad.toLocaleDateString()}.`);
            }

            let PspCaducidad = new Date(residente.fin_pasaporte_res);
            if (tresMesesAntes(PspCaducidad)) {
                alertMessage.push(`Tu Pasaporte caducará el ${PspCaducidad.toLocaleDateString()}.`);
            }

            //Si hay mensajes insertarlos en la columna de alerta de la base de datos en la tabla residentes_aire, siempre que ya no haya ya un mensaje 
            if (alertMessage.length > 0 && !residente.alerta) {
                //Junatr si hay más mensajes
                const alerta = alertMessage.join(' ');

                const update = 'UPDATE residentes_aire SET alerta = ? WHERE id_residente = ?';
                connection.query(update, [alerta, residente.id_residente], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta a la base de datos:', err);
                        return;
                    } else {
                        console.log('Mensaje de alerta actualizado');
                    };

                });
            };

        });
    });
};
//verificaFechas();

/* FUNCIÓN tresMesesAntes()*/
//Compara la fecha de hoy con la pasada en el parametro y verifica los 3 meses de diferencia
//Hará sí que si el resultado es true se inserten los mensajes en la base de datos
function tresMesesAntes(fecha){
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() + 3);
    return fecha < hoy;
};

/* PROGRAMAR LA VERIFICACIÓN CADA DÍA A LAS 6:00 CON CRON*/
//Establece la hora en la que se llamará la función
cron.schedule('0 13 * * *', () =>{
    console.log('Verificando fechas 6:00 AM');
    //Llamada a la función
    verificaFechas();
},{
    //Indica que la tarea está programada para ejecutarse
    scheduled: true,
    //Ajusta la zona horaria
    timezone: 'Europe/Madrid'
});


//Inicializar Puertos
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
appUser.listen(PORT_USER, () => {
    console.log(`Servidor en: http://localhost:${PORT_USER}`);
});
