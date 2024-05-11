
const fs = require('fs');

// Leer el archivo de datos
const readJson = fs.readFileSync('datos.json');
// Devuelve un objeto JS que se llamará data
const dataJson = JSON.parse(readJson);

//Verificar que esté leyendo el archivo json
//console.log(dataJson);

// Esta función se llamará para verificar que falten 3 años a la fecha establecida
function verifyThreeMonths(date) {
    //Guarda la fecha actual 
    let threeMonths = new Date();
    // Reasigna la fecha actual añadiendo los 3 meses
    threeMonths.setMonth(threeMonths.getMonth() + 3);

    // Cada variable almacenará el tiempo que queda en años, meses y días para llegar a los tres meses antes de la fecha establecita 'date'
    let year = date.getFullYear() - threeMonths.getFullYear();// años que faltan
    let month = date.getMonth() - threeMonths.getMonth();// mes que faltan
    let day = date.getDate() - threeMonths.getDate();// día que faltan

    //console.log(year, month, day);

    //En el return se compararán los datos y si se cumplen las condiciones devolverá true de lo contrario false
    return year < 0 || (year === 0 && month < 0) || (year === 0 && month === 0 && day < 0);
}

//Verificar que verifyThreeMonths(date) funcione
//console.log(verifyThreeMonths(new Date('2024-10-11')));

// Recorrer el array de objetos dataJson para verificar las fecha que cumplen la condición
function usuariosMail(){
    dataJson.forEach(element => {
    // Guarda la fecha de cada objeto del array
    let dateStart = new Date(element.fecha);
    //Reasigna a cada año de la fecha el valor original más diez años (tiempo en el que se caducan DNI y Pasaportes italianos)
    dateStart.setFullYear(dateStart.getFullYear() + 10);

    // Verificar que devuelva bien las fechas
    //console.log(dateStart.toLocaleDateString());
    //console.log(verifyThreeMonths(dateStart));

    // Verifica para que ususario se cumpla la condición. O sea cuando la función verifyThreeMonths(date) devolverá true
    if (verifyThreeMonths(dateStart)) {
        // Aquí es donde se programará el envio automatico del correo electronico con la fecha de la cita
        console.log('USUARIO:');
        console.log(`nombre: ${element.nombre}, fecha emissión DNI: ${element.fecha}, fecha caducidad DNI: ${dateStart.toLocaleDateString()}`);
        console.log('=========================');
    }
})};

usuariosMail();

//Falta programar la ejecución automatica cada 24h a una hora establecida