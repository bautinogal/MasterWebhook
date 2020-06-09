const express = require('express');
const bodyParser = require('body-parser');
const queue = require('../lib/queue');

const webhookRoute = (req, res) => {
    console.log("NEW POST FROM: " + req.protocol + '://' + req.get('client') + req.originalUrl)
    const message = {
        text: req.body,
    };
    queue
        .send('incoming', message)
        .then(() => {
            res.end('Received ' + JSON.stringify(message));
            //return queue.send('socket', record);
        })
        .catch(e => {
            console.error(e);
            res.status(500);
            res.end(e.message);
        });
};

const router = express.Router();
router.post('/', bodyParser.text({ type: '*/*' }), webhookRoute);

module.exports = router;