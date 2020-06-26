const path = require('path'); // Herramienta para armar los paths independientemente del S.O.
const express = require('express'); // Framework de Node para armar servidores
const morgan = require('morgan'); // Herramienta para loggear
const routes = require('./routes/index'); // Script que administra los "Endpoints"
const fs = require('fs');
const http = require('http');
const https = require('https');
require('./config/collectionConfig.js');

// Inicializo el servidor
const app = express();
console.log(`App: Inicializando Servidor...`);

// Configuración del servidor
console.log(`App: Configurando el Servidor:`);
app.set('port', process.env.PORT || 3000);
console.log(`App: Puerto del servidor seteado en: ${app.get('port')}`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log(`App: Usando "ejs" como "View Engine"`);
console.log(`App: Servidor Configurado.`);

// Adición de Middlewares al servidor
console.log(`App: Agregando Middleware al Servidor:`);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // Loggea los requests
app.use(express.urlencoded({ extended: false })) // Herramienta para parsear los JSONs que llegan en los requests
console.log(`App: Middleware agregado.`);
// TODO: SEGURIDAD, VALIDACIONES, ETC...

// Carga de endpoints
console.log(`App: Cargando rutas al Servidor:`);
app.use('/', routes);
console.log(`App: Rutas cargadas:`);

// Prendo worker que va a mover los mensajes de la cola a la bd
require('./workers/wRabToMdb');

// Puesta en marcha del servidor
console.log(`App: Servidor Listo!`);


//Inicio sin credenciales:
app.listen(app.get('port'), () => {
    console.log(`App: Servidor escuchando en el puerto:  ${app.get('port')}`);
});


/*
//Inicio con credenciales:

//Parametros de los certicados/keys ssl del servidor
const opts = {
    cert: fs.readFileSync('./ssl/star_masterbus_net_28693247star_masterbus_net.crt'),
    ca: fs.readFileSync('./ssl/star_masterbus_net_28693247DigiCertCA.crt'),
    key: fs.readFileSync('./ssl/.ssh/privatekey.key'),
    requestCert: false,
    rejectUnauthorized: false
}

console.log("Key: " + opts.key);
console.log("Cert: " + opts.cert);
console.log("Ca: " + opts.ca);

https.createServer(opts, app).listen(app.get('port'), () => {
    console.log(`App: Servidor escuchando en el puerto:  ${app.get('port')}`);
});*/