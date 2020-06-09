const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost:27017/notifier';

//DUDA: no se que significan esos parametros
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', console.error);

// DUDA: Tengo que usar un SCHEMA??
const messageSchema = new mongoose.Schema({
    Fecha: String,
    Mensaje: String,
    Codigo: String,
    Latitud: String,
    Longitud: String,
    Interno: String,
    Patente: String
});

const Message = mongoose.model('Message', messageSchema);

const create = attrs => new Message(attrs).save();

//PROBLEMA: Por alguna razón "messages" no existe y me tira error mas adelante
const list = () => Message
    .find()
    .then(messages => messages.slice().reverse())
    .catch(e => {
        console.log("Error con Messages");
        console.error(e);
    });

module.exports = { create, list };