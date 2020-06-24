const express = require('express');
const router = express.Router();
const queue = require('../lib/queue');
const bodyParser = require('body-parser');
const repo = require('../lib/repo');
const config = require('../config/config');
const utils = require('../lib/utils');


function ArrayObjFilter(arrObj, filters) {
    return arrObj.map(obj => utils.objFilter(obj, filters))
}

//Devuelve un objeto en el que agrega URL, Protocolo y TimeStamp
function addReqInfo(message, req) {
    const timeStamp = Date.now();
    const protocol = req.protocol;
    const url = req.socket.remoteAddress;
    message.serverReceivedTS = timeStamp;
    message.protocol = protocol;
    message.url = url;
    return message;
}

//
function dataGet(query) {
    console.log("routes@dataGet: Query: %s", query);
    return new Promise((resolve, reject) => {
        repo.find(0, 100, query, config.messageCollectionName)
            .then(result => resolve(result))
            .catch(err => {
                console.log("err /api/getlist: ", err);
                reject(err)
            });
    })
}

//Endpoints de la pagina:
//Paginated Table
router.get('/table', async(req, res) => {
    //1-obtener un array de datos que quiero mostrar en la tabla
    //2- formatearlo para que la tabla en la view lo pueda usar
    //3-pasarle el array en la view
    //MEJORAS:
    //1-le paso la cantidad total de documentos 
    //2-agregar paginacion
    //3-que la view redireccione a este mismo endpoint con el numero de paginacion que clickea el user


    console.log('Routes@/table: Requesting table from: %s, query: %s', req.url, req.query);

    let query = "";
    console.log("Routes@api/table: Parsing query: %s", query);
    try {
        query = JSON.parse(req.query.q || "{}");
        console.log("Routes@api/table: Query parsed succesfully, query: %s", query);
    } catch (e) {
        console.log("Routes@api/table: Error parsing query: %s", req.query.q);
        return res.status(400).send("Error parsing query!");
    }

    query = req.query.buscar || undefined;

    //1-obtener un array de datos que quiero mostrar en la tabla
    let filters = ["score", "serverReceived", "protocol", "url", "serverEnqueuedTS", "serverEnqueued"] //U: que keys no quiero mostrar en mi tabla
    let headers = ['Id', 'Fecha', 'Mensaje', 'Codigo', 'Latitud', 'Logitud', 'Interno', 'Patente', 'serverReceivedTS'] //A: los titulos de la tabla que mostramos para los mensajes que nos llegaron

    //DataGet devuelve un array que tiene todos los documentos en el primer elemento y la cantidad total en el segundo(de toda la db)

    let data = await dataGet(query);
    console.log("Routes@api/table: dataGet result: %s", data);
    let documents = data[0];
    result = ArrayObjFilter(documents, filters);
    let messages = result.map(result => Object.values(result)) //A: array de arrays con los values del diccioonario devuelto por la base de datos para darselo a la tabla 
    let messagesCount = data.count;
    //console.log("Routes@api/table: messages: " + messages);
    res.render('messageTable', { rows: messages, messagesCount, headers })

});

//Endpoints de las APIS:
//Recivo un evento y lo encolo
//TODO: agregar error handler cuando el body es un JSON invalido
router.post('/addpost', bodyParser.text({ type: '*/*' }), async(req, res, next) => {
    // "addReqInfo" agrega el timeStamp, protocolo y url al objeto "message" ademas de lo q viene en el "req.body"
    const message = addReqInfo(JSON.parse(req.body), req);
    const queueName = 'IncomingMessages';
    console.log('Routes@api/add: Sending incoming request to "%s" queue. Message : %s', queueName, message);
    queue
        .send(queueName, message);
    res.end('Routes@api/add: Received ' + JSON.stringify(message));
    //TODO: mas adelante devería enviar un mensaje al cliente cuando se guardo en la bd y su ID
});

//Devuelvo una lista filtrada por el query
//TODO: revisar como recibimos la query y si no hay q mover cosas a otro lado...
router.get('/api/getlist', async(req, res, next) => {
    let query = {};
    let desde = Number(req.query.desde || 0);
    let cantidad = Number(req.query.cantidad || 20);
    let buscar = req.query.buscar;
    console.log("Routes@api/getlist: Parsing query: %s", query);

    //TODO: agregar querys mas complejos
    repo.find(desde, cantidad, buscar, config.messageCollectionName)
        .then(result => res.send(result))
        .catch(err => {
            console.log("err /api/getlist: ", err);
            res.send("error listado")
        });
});

module.exports = router;