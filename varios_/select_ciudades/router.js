require('dotenv').config();
//Cargar mysql
const mysql = require('mysql');

const express = require('express');
// cargar configurador de rutas
const router = express.Router();

const configMysql = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};



const connMysql = mysql.createConnection(configMysql);

/* router.get('/', (req, res) => {
    //console.log(configMysql);
    const select = 'SELECT id, comune, s_provincia FROM comuni_italiani limit 5';
    connMysql.query(select, (err, result) => {
        if (err) throw err;
        //console.log(result);
        res.render('index', {datos: result});
    });
}); */

connMysql.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

router.get('/', async (req, res) => {
    try {
        const comuniQuery = 'SELECT id, comune, s_provincia FROM comuni_italiani LIMIT 5';
        const provinciasQuery = 'SELECT id, nombre_es FROM provincias_espana LIMIT 5';

        // convertir la callback a una promesa para poder usar async/await
        const query = (sql) => {
            return new Promise((resolve, reject) => {
                connMysql.query(sql, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        };

        // Ejecutar ambas consultas en paralelo
        const [comuniResult, provinciasResult] = await Promise.all([
            query(comuniQuery),
            query(provinciasQuery)
        ]);

        // Renderizar la vista con los datos de ambas tablas
        res.render('index', { 
          datos: comuniResult,
          datosEs: provinciasResult
        });

        // Enviar los resultados como respuesta JSON
        /* res.json({
            comuni: comuniResult,
            provincias: provinciasResult
        }); */

      /*   if (req.accepts('json')) {
            res.json({ 
                comuni: comuniResult,
                provincias: provinciasResult
            });
        } else {
            // Si no se solicita JSON, renderizar la vista con los datos
            res.render('index', { 
                datos: comuniResult,
                datosEs: provinciasResult
            });
        } */

    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;