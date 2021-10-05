const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors())
// Configurar cabeceras y cors
var whitelist = ['http://localhost:4000','http://localhost:3000']                               
var corsOptions = {
  origin: function (origin, callback) {
      console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {

      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}




// Directorio Público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );
app.use('/api/calls', require('./routes/calls'));
app.use('/api/puntoConsulta', require('./routes/puntoConsulta'));
// app.use('/api/puntoConsulta', cors(corsOptions) , require('./routes/puntoConsulta'));

app.get("/prueba", async function (req, res) {
    return res.json({hola: "chao"})
  });



// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});






