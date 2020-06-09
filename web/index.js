const http = require('http');
const express = require('express');
//API para hacer POST de los eventos
const webhookRouter = require('./webhook');
const listRouter = require('./list');
const configureWebSockets = require('./socket');

const app = express();

//API para hacer POST de los eventos
app.use('/addpost', webhookRouter);
//API para hacer GET de la lista de eventos
app.use('/getposts', listRouter);

const server = http.createServer(app);
configureWebSockets(server);

const { PORT = 3000 } = process.env;
server.listen(PORT);
console.log(`listening on port ${PORT}`);