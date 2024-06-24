
const connection = require('../data/db.js')

//Función para verificar las fechas a las che faltan 3 meses para llegar 
function tresMesesAntes(fecha) {
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() + 3);
    return fecha < hoy;
};

//Función que genera horas de citas entre las 8 y las 14 cada 15 minutos
function horasCitas(fecha){
    //creo un array donde guardar las horas
    const horas = [];
    const inicio = new Date();
    //seteo la hora de la varianble inicio y fin 
    inicio.setHours(8, 0, 0, 0);
    const fin = new Date();
    fin.setHours(14, 0, 0, 0);

    //Mientras inicio sea < que fin se guarda en el array añadiendo 15 minutos
    while (inicio < fin) {
        horas.push(inicio);
        inicio.setMinutes(inicio.getMinutes() + 15);
    };
    return horas;
};

//función que verifica, en la BD, si ya existe una cita para el mismo residente para el mismo tipo de documento
function hayCitas(id_residente, tipo_documento, cb){
   const verCita = 'SELECT COUNT(*) FROM cita_dni_res WHERE fecha_cita_res = ? AND tipo_documento = ?';
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
function existeCita(fecha_cita, cb){
    const hayCita = 'SELECT COUNT(*) FROM cita_dni_res WHERE fecha_cita_res = ?';
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
    //Calcular um mes antes de que se caduque DNI o Pasaporte
    let mesAntes = new Date(residente.residente.fin_dni_res);
    if(tipoDocumento === 'Pasaporte'){
        mesAntes = new Date(residente.residente.fin_pasaporte_res);
    }
    mesAntes.setMonth(mesAntes.getMonth() - 1);

    function buscarHoraDisponible(fecha){
        const horasDisponibles = horasCitas(fecha);
        
    }
}

