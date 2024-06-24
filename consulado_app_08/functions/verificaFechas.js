
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
                            dosMesesAntesCaducidad.setMonth(dosMesesAntesCaducidad.getMonth() - 2);
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