

const auth = require('./auth');
const categoria = require('./categoria');
const bodega = require('./bodega');
const user = require('./user');
const modelo = require('./modelo');
const tecnico = require('./tecnico');


module.exports = {
    ...auth,
    ...bodega,
    ...user,
    ...modelo,
    ...categoria,
    ...tecnico
}