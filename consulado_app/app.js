//Requiero los modulos que necesito
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const routerBack = require('./routes/routerBack');

//inicializar express
const app = express();

//configurar puerto
const PORT  = process.env.PORT || 3000;

//Definir motor de plantilla
app.set('view engine', 'ejs');
app.set('views', './views');

//utilizar capreta de recursos estaticos

app.use(express.static('public'));

//configurar cookie-parser
//app.use(cookieParser());

//procesar datos desde formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas
app.use(routerBack);

//Inicializar Puerto
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
