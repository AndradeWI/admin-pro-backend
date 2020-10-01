require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConection } = require('./database/config')

// Criar o servidor express
const app = express();

// Configurar CORS
app.use( cors() );

// Base de dados
dbConection();


// Rotas
app.get( '/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Olá Mundo'
    })
})



app.listen( process.env.PORT, () => {
    console.log('Servidor rodando na porta ' + process.env.PORT);
});