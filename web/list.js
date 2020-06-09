const express = require('express');
const repo = require('../lib/repo');

const listRoute = (req, res) => {
    console.log("GET POSTS FROM: " + req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log(JSON.stringify(messages));
    repo
        .list()
        .then(messages => {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(messages));
        })
        .catch(e => {
            console.error(e);
            res.status(500);
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
        });
};

const router = express.Router();
router.get('/', listRoute);

module.exports = router;