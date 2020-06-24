function objFilter(obj, filters) { //U:recibe los filters para limpiar el obj pasado como parametro
    let newObj = {};
    for (let key in obj) {
        if (!filters.includes(key))
            newObj[key] = obj[key]
    }
    return newObj;
}

//U: Me devuelve el valor del parametro de la query de la url
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

module.exports = { objFilter, getParameterByName };