var MongoPool = require('./mongoDbConfig');

async function save(collectionName, document) { //U: guardar un documento en la colleccion pasada, devuelve una promesa
    let db = await MongoPool.getInstance(); //A: obtengo una coneccion existente o creo una nueva con la db
    if (typeof(document) === "object") {
        return db.collection(collectionName).insert(document)
    } else {
        return db.collection(collectionName).insertMany(document)
    }
}

const find = function(desde, cantidad, buscar, coleccion) {
    console.log("desde: ", desde, " hasta: ", cantidad, " buscar: ", buscar, " coleccion: ", coleccion)
    let query = {}
    if (buscar) {
        query = { $text: { $search: buscar } }
    }
    console.log("FindTest: query: %s", query);
    return new Promise(async(resolve, reject) => {
        let db = await MongoPool.getInstance();
        db.collection(coleccion).find(query)
            .skip(desde)
            .limit(cantidad)
            .project({ score: { $meta: "textScore" } }) //A: le digo que me devuelva los objectos con un score de coincidencia
            .sort({ score: { $meta: "textScore" } }) //A: lo ordeno segun el score, el que mas se parece lo dejo primero
            .toArray(async(err, users) => {
                let count = await db.collection(coleccion).countDocuments(query);
                if (err) reject(err)
                resolve([users, count])
            })
    })
}

module.exports = { save, find };