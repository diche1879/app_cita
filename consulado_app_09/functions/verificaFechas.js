/* const connection = require('../data/db.js');

function obtenerUltimaCitaDelDia(fecha, callback) {
    // Definir el rango del día completo hasta las 14:00
    const fechaInicio = new Date(fecha.setHours(0, 0, 0, 0));
    const fechaFin = new Date(fecha.setHours(14, 0, 0, 0)); // Hasta las 14:00

    // Consulta SQL para obtener la última cita del día
    const query = 'SELECT fecha_cita_res FROM cita_dni_res WHERE fecha_cita_res BETWEEN ? AND ? ORDER BY fecha_cita_res DESC LIMIT 1';

    connection.query(query, [fechaInicio, fechaFin], (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return callback(err, null);
        }
        callback(null, results.length > 0 ? new Date(results[0].fecha_cita_res) : null);
    });
}

function programarCita(fechaCita, residente, tipoDocumento, callback) {
    obtenerUltimaCitaDelDia(fechaCita, (err, ultimaCita) => {
        if (err) {
            return callback(err);
        }

        let nuevaFechaCita;
        const finCitas = new Date(fechaCita.setHours(14, 0, 0, 0)); // Hora límite para citas

        if (ultimaCita) {
            // Añadir 15 minutos a la última cita
            nuevaFechaCita = new Date(ultimaCita.getTime() + 15 * 60 * 1000);

            // Si la nueva cita es después de las 14:00, pasar al siguiente día
            if (nuevaFechaCita > finCitas) {
                fechaCita.setDate(fechaCita.getDate() + 1); // Siguiente día
                // Ajustar para que no sea fin de semana (si es necesario)
                if (fechaCita.getDay() === 6) fechaCita.setDate(fechaCita.getDate() + 2); // Si es sábado, pasar a lunes
                if (fechaCita.getDay() === 0) fechaCita.setDate(fechaCita.getDate() + 1); // Si es domingo, pasar a lunes
                return programarCita(fechaCita, residente, tipoDocumento, callback); // Repetir para el siguiente día
            }
        } else {
            // Si no hay citas previas, establecer la primera cita del día
            nuevaFechaCita = new Date(fechaCita.setHours(9, 0, 0, 0)); // Por ejemplo, empezar a las 9 AM
        }

        // Formatear la fecha de la cita para insertarla en la columna de la base de datos, que es de tipo datetime
        const formattedFechaCita = nuevaFechaCita.toISOString().slice(0, 19).replace('T', ' ');

        // Insertar la nueva cita en la base de datos
        const insertCita = 'INSERT INTO cita_dni_res (id_residente, nombre_res, apellido_res, fecha_cita_res, tipo_documento) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertCita, [residente.id_residente, residente.nombre_res, residente.apellido_res, formattedFechaCita, tipoDocumento], (err, result) => {
            if (err) {
                console.error('Error al insertar la nueva cita en la base de datos:', err);
                return callback(err);
            }
            console.log('Nueva cita programada:', formattedFechaCita);
            callback(null, formattedFechaCita);
        });
    });
}

function tresMesesAntes(fecha) {
    const hoy = new Date();
    const tresMesesAntes = new Date(hoy.setMonth(hoy.getMonth() + 3));
    return fecha <= tresMesesAntes;
}

function verificaFechas() {
    const selectCitas = 'SELECT id_residente, nombre_res, apellido_res, fin_dni_res, fin_pasaporte_res, alerta FROM residentes_aire';
    connection.query(selectCitas, (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return;
        }

        results.forEach(residente => {
            let alertMessage = [];
            let tipoDocumento = '';

            let dniCaducidad = new Date(residente.fin_dni_res);
            if (tresMesesAntes(dniCaducidad)) {
                alertMessage.push(`Tu DNI caducará el ${dniCaducidad.toLocaleDateString()}.`);
                tipoDocumento = 'DNI';
            }

            let pasaporteCaducidad = new Date(residente.fin_pasaporte_res);
            if (tresMesesAntes(pasaporteCaducidad)) {
                alertMessage.push(`Tu Pasaporte caducará el ${pasaporteCaducidad.toLocaleDateString()}.`);
                tipoDocumento = 'Pasaporte';
            }

            if (alertMessage.length > 0 && !residente.alerta) {
                const alerta = alertMessage.join(' ');

                const update = 'UPDATE residentes_aire SET alerta = ? WHERE id_residente = ?';
                connection.query(update, [alerta, residente.id_residente], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta a la base de datos:', err);
                        return;
                    }
                    console.log('Mensaje de alerta actualizado');

                    let fechaCita = new Date();
                    fechaCita.setMonth(fechaCita.getMonth() + 2);

                    programarCita(fechaCita, residente, tipoDocumento, (err, nuevaFechaCita) => {
                        if (err) {
                            console.error('Error al programar la cita:', err);
                            return;
                        }
                        console.log('Cita programada para:', nuevaFechaCita);
                    });
                });
            }
        });
    });
}

module.exports = {
    obtenerUltimaCitaDelDia,
    programarCita,
    verificaFechas
}; */

/* 
const connection = require('../data/db.js')

//Función para verificar las fechas a las che faltan 3 meses para llegar 
function tresMesesAntes(fecha) {
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() + 3);
    return fecha < hoy;
};

//Función que genera horas de citas entre las 8 y las 14 cada 15 minutos
function generarhorasCitas(fecha){
    //creo un array donde guardar las horas
    const horas = [];
    const inicio = new Date();
    //seteo la hora de la varianble inicio y fin 
    inicio.setHours(8, 0, 0, 0);
    const fin = new Date();
    fin.setHours(14, 0, 0, 0);

    //Mientras inicio sea < que fin se guarda en el array añadiendo 15 minutos
    while (inicio < fin) {
        horas.push(new Date(inicio));
        inicio.setMinutes(inicio.getMinutes() + 15);
    };
    return horas;
};

//función que verifica, en la BD, si ya existe una cita para el mismo residente para el mismo tipo de documento
function hayCita(id_residente, tipo_documento, cb){
   const verCita = 'SELECT COUNT(*) AS count FROM cita_dni_res WHERE id_residente = ? AND tipo_documento = ?';
   connection.query(verCita, [id_residente, tipo_documento], (err,result) => {
    if (err) {
        console.error('Error al verificar la existencia de citas:', err);
        cb(err, false);
        return;
    }

    //Obtener el número de citas del residente
    const count = result[0].count;
    //Devuelve true si hay citas, false si no hay citas. El cb(callback) null indica que no hubo errores
    cb(null, count > 0);
   })

}

//Función que verifica si existe, en la BD, ya una cita en la hora dada
function existeCitaHora(fecha_cita, cb){
    const hayCita = 'SELECT COUNT(*) AS count FROM cita_dni_res WHERE fecha_cita_res = ?';
    connection.query(hayCita, [fecha_cita], (err, result) => {
        if (err) {
            console.error('Error al verificar la existencia de citas:', err);
            cb(err, false);
            return;
        }
        const count = result[0].count;
        cb(null, count > 0);
    });
};

//Función que crea un mensaje basado en las fechas de caducidad de DNI o pasaporte
function crearAlerta(residente){
    let alertMessage = [];
    let tipoDocumento = '';

    let dniCaducidad = new Date(residente.fin_dni_res);
    //Llama la función tresMesesAntes() y le pasa la fecha de caducidad del documento si se cumple añade el mensaje de alerta al array y el asigna el valor de DNI
    if (tresMesesAntes(dniCaducidad)) {
        alertMessage.push(`Tu DNI caducará el ${dniCaducidad.toLocaleDateString()}.`);
        tipoDocumento = 'DNI';
    }

    let PspCaducidad = new Date(residente.fin_pasaporte_res);
    //Llama la función tresMesesAntes() y le pasa la fecha de caducidad del documento si se cumple añade el mensaje de alerta al array y el asigna el valor de pasaporte
    if (tresMesesAntes(PspCaducidad)) {
        alertMessage.push(`Tu pasaporte caducará el ${PspCaducidad.toLocaleDateString()}.`);
        tipoDocumento = 'Pasaporte';
    }
    return {
        alertMessage,
        tipoDocumento
    }
};

//Funcion que actualiza el campo de alerta en la BD
function actualizarAlerta(residente, alerta){
    const updateAlerta = 'UPDATE residentes_aire SET alerta =? WHERE id_residente =?';
    connection.query(updateAlerta, [alerta, residente.id_residente], (err, result) => {
        if (err) {
            console.error('Error al actualizar la alerta:', err);
            return;
        }
        console.log('mensaje de alerta actualizado');
    });
};

function programarCita(residente, tipoDocumento){
    //Calcular um mes antes de que se caduque DNI o Pasaporte.Utiliza fin_dni_res por defecto
    let unMesAntesCaducidad = new Date(residente.fin_dni_res);
    //Utiliza fin_pasaporte_res si el tipo de documento es pasaporte
    if(tipoDocumento === 'Pasaporte'){
        unMesAntesCaducidad = new Date(residente.fin_pasaporte_res);
    }
    //Le resta un mes a la fecha de caducidad
    unMesAntesCaducidad.setMonth(unMesAntesCaducidad.getMonth() - 1);

    //Busca una hora disponible en una fecha data
    function buscarHoraDisponible(fecha){
        //Crea un array con las horas de citas entre las 8 y las 14 cada 15 minutos
        const horasDisponibles = generarhorasCitas(fecha);

        // Verifica si hay horas disponibles en un index especifico
        function verificarHora(index){
            if(index >= horasDisponibles.length){
                //Verifica si no hay horas disponibles en ese día y pasa al siguiente
                fecha.setDate (fecha.getDate() + 1);
                buscarHoraDisponible(fecha);
                return;
            }

            //formatea la fecha en un formato adecuado
            const fechaCita = horasDisponibles[index];
            const formattedFechaCita = fechaCita.toISOString().slice(0,19).replace('T', ' ');

            //Verifica si existe una cita para ese residente en ese tipo de documento en esa fecha
            existeCitaHora(formattedFechaCita, (err, existe) =>{
                if (err) {
                    console.error('Error al verificar la existencia de citas:', err);
                    return;
                }
                if (!existe) {
                    //Datos para el INSERT de la cita
                    const cita = {
                        id_residente: residente.id_residente,
                        nombre_res: residente.nombre_res,
                        apellido_res: residente.apellido_res,
                        fecha_cita_res: formattedFechaCita,
                        tipo_documento: tipoDocumento
                    };
                    //Inserta la cita en la BD
                    const insertCita = 'INSERT INTO cita_dni_res (id_residente, nombre_res, apellido_res, fecha_cita_res, tipo_documento) VALUES (?,?,?,?,?)';
                    connection.query(insertCita, [cita.id_residente, cita.nombre_res, cita.apellido_res, cita.fecha_cita_res, cita.tipo_documento], (err, result) =>{
                        if (err) {
                            console.error('Error al insertar la cita:', err);
                            return;
                        }
                        console.log('Cita insertada');
                    });
                }else{
                    // Si ya existe una cita en esta hora verifica la siguiente hora disponible
                    verificarHora(index + 1);
                };
            });
        }
        // Verifica desde la primera hora disponible
        verificarHora(0);
    }
    //Busca una hora disponible un mes antes de la fecha de caducidad del documento
    buscarHoraDisponible(unMesAntesCaducidad);
};

// Función principal que verifica fechas y se comporta de consecuencia
function verificaFechas(){
    const selectCitas = 'SELECT * FROM residentes_aire';
    connection.query(selectCitas, (err, results) => {
        if (err) {
            console.error('Error al obtener los residentes:', err);
            return;
        }
        results.forEach(residente => {
            const {alertMessage, tipoDocumento} = crearAlerta(residente);

            //Si hay alerta y el tipo de documento es DNI o Pasaporte
            if(alertMessage.length > 0 && !residente.alerta){
                const alerta = alertMessage.join (' ');
                actualizarAlerta(residente, alerta);

                hayCita(residente.id_residente, tipoDocumento, (err, existe) => {
                    if (err) {
                        console.error('Error al verificar la existencia de citas:', err);
                        return;
                    }
                    if (!existe) {
                        programarCita(residente, tipoDocumento);
                    }
                });
            }
        });
    });

}

module.exports = verificaFechas; */


const connection = require('../data/db.js')

function tresMesesAntes(fecha) {
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() + 3);
    return fecha < hoy;
};

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
            //identificar que tipo de documento se caducará
            let tipoDocumento = '';

            let dniCaducidad = new Date(residente.fin_dni_res);
            if (tresMesesAntes(dniCaducidad)) {
                alertMessage.push(`Tu DNI caducará el ${dniCaducidad.toLocaleDateString()}.`);
                tipoDocumento = 'DNI';
            }

            let PspCaducidad = new Date(residente.fin_pasaporte_res);
            if (tresMesesAntes(PspCaducidad)) {
                alertMessage.push(`Tu Pasaporte caducará el ${PspCaducidad.toLocaleDateString()}.`);
                tipoDocumento = 'Pasaporte';
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
                    }
                    console.log('Mensaje de alerta actualizado');

                    //Generar hora aleatoria entre 8AM y 14PM
                    function horaCita() {
                        const horas = [8, 9, 10, 11, 12, 13, 14];
                        const hora = horas[Math.floor(Math.random() * horas.length)];
                        let fechaCita = new Date();
                        fechaCita.setHours(hora, 0, 0, 0);
                        return fechaCita;
                    }

                    //Verificar si existe ya una cita para el mismo tramite
                    function hayCita(id_residente, tipo_documento, callback) {
                        const verCita = 'SELECT COUNT(*) AS count FROM cita_dni_res WHERE id_residente = ? AND tipo_documento = ?';
                        connection.query(verCita, [id_residente, tipo_documento], (err, result) => {
                            if (err) {
                                console.error('Error al verificar la existencia de citas:', err);
                                callback(err, false);
                                return;
                            }
                            const count = result[0].count;
                            callback(null, count > 0);
                        })

                    }
                    hayCita(residente.id_residente, tipoDocumento, (err, existe) => {
                        if (err) {
                            console.error('Error al verificar la existencia de citas:', err);
                            return;
                        }
                        if (!existe) {
                            let fechaCita = horaCita();

                            // Calcular dos meses antes de la caducidad del documento
                            let dosMesesAntesCaducidad = new Date(residente.fin_dni_res); // Utiliza fin_dni_res o fin_pasaporte_res según corresponda
                            if (tipoDocumento === 'Pasaporte') {
                                dosMesesAntesCaducidad = new Date(residente.fin_pasaporte_res);
                            }
                            dosMesesAntesCaducidad.setMonth(dosMesesAntesCaducidad.getMonth() - 1);
                            fechaCita.setFullYear(dosMesesAntesCaducidad.getFullYear(), dosMesesAntesCaducidad.getMonth(), dosMesesAntesCaducidad.getDate());

                            // Formatear la fecha de la cita para insertarla en la base de datos
                            const formattedFechaCita = fechaCita.toISOString().slice(0, 19).replace('T', ' ');

                            // Datos para el insert de la cita
                            const cita = {
                                id_residente: residente.id_residente,
                                nombre_res: residente.nombre_res,
                                apellido_res: residente.apellido_res,
                                fecha_cita_res: formattedFechaCita,
                                tipo_documento: tipoDocumento
                            };
                            const insertCita = 'INSERT INTO cita_dni_res (id_residente, nombre_res, apellido_res, fecha_cita_res, tipo_documento) VALUES (?, ?, ?, ?, ?)';
                            connection.query(insertCita, [cita.id_residente, cita.nombre_res, cita.apellido_res, cita.fecha_cita_res, cita.tipo_documento], (err, result) => {
                                if (err) {
                                    console.error('Error en la consulta a la base de datos:', err);
                                    return;
                                }
                                console.log('Cita insertada');
                            })

                        };
                    });

                });
            };

        });
    });
};

module.exports = verificaFechas;