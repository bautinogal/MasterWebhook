var MongoPool = require('../lib/mongodb/mongoDbConfig.js');
var config = require('./config.js');

console.log("collectionConfig loaded!");

MongoPool.getInstance().then((db) => {
    // Get the users collection
    const collection = db.collection(config.messageCollectionName);
    // Create the index

    //A: crear un index para buscar por texto en todos los campos
    collection.createIndex({ "$**": "text" }, function(err, result) {
        if (err) console.log("err: ", err);
        console.log("result: ", result)
    })
}).catch((err) => {
    console.log("err: ", err);
});