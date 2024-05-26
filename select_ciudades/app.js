const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./router');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(router);

app.listen(PORT, () =>{
    console.log(`El servidor esta escuchando en http://localhost:${PORT}`);
})