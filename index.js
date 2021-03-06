require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConection } = require('./database/config')

// Criar o servidor express
const app = express();

// Configurar CORS
app.use( cors() );

// Leitura e parse do body
app.use( express.json() );

// Base de dados
dbConection();

// Diretório público
app.use( express.static('public') );

// Rotas
app.use( '/api/usuarios', require('./routes/usuarios.routes') );
app.use( '/api/hospitais', require('./routes/hospitais.routes') );
app.use( '/api/medicos', require('./routes/medicos.routes') );
app.use( '/api/todo', require('./routes/buscas.routes') );
app.use( '/api/login', require('./routes/auth.routes') );
app.use( '/api/upload', require('./routes/uploads.routes') );


app.listen( process.env.PORT, () => {
    console.log('Servidor rodando na porta ' + process.env.PORT);
});