const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// console.log(process.env);



// crear servidor/app de express
const app = express();

dbConnection();
// Directorio public
app.use(express.static('public'))

//CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// RUTAS 
app.use( '/api/auth', require('./routes/auth') );

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${ process.env.PORT }`);
});