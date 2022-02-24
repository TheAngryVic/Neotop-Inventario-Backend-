
const {Modelo} = require('./modelo');
const {Bodega} = require('./bodega');
const {Producto} = require('./producto');
const {Rol} = require('./role');
const {Usuario} = require('./usuario');
const {Categoria} = require('./categoria');
const {Movimiento} = require('./movimiento');
const {Tecnico} = require('./tecnico');

module.exports = {
    Bodega,    
    Categoria,
    Modelo,
    Movimiento,
    Producto,
    Rol,
    Tecnico,
    Usuario,
};