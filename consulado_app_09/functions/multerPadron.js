const multer = require('multer');
//Usamos fs de node para renombrar y guardar los files enviados
const fs = require('fs');
const path = require('path');

/* CONFIGURAR ALMACENAMIENTO DE MULTER */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads_padron/');//Directorio de almacenamiento
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);//recupera el nombre original del file y añade el datenow para asegurar que cada archivo sea unico
    }
});

/* FILTRAR LOS TIPOS DE ARCHIVO PERMITIDOS */
const fileFilter= (req, file, cb) => {
    //Tipos de files permitidos
    const tipoFiles = ['.jpg', '.jpeg', '.png', '.pdf'];
    const extensionFile = path.extname(file.originalname).toLowerCase();
    if (tipoFiles.includes(extensionFile)) {
        cb(null, true);//Si el array tipoFiles include el tipo de file enviado
    }else{
        cb(new Error(`File ${file.originalname} no es un formato valido. Solo se pueden subir archivos: JPG, JPEG, PNG Y PDF (Es indiferente el uso de las mayusculas)`))
    }
};

/* CONFIGURAR MULTER */
const upload = multer({
    storage,
    fileFilter
});

module.exports = {upload};