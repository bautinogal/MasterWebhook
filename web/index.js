const http = require('http');
const express = require('express');
const webhookRouter = require('./webhook');
const listRouter = require('./list');
const configureWebSockets = require('./socket');

const app = express();

app.use('/addpost', webhookRouter);
app.use('/getposts', listRouter);

const server = http.createServer(app);
configureWebSockets(server);

const { PORT = 3000 } = process.env;
server.listen(PORT);
console.log(`listening on port ${PORT}`);