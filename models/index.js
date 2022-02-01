
const {Modelo} = require('./modelo');
const {Bodega} = require('./bodega');
const {Producto} = require('./producto');
const {Rol} = require('./role');
const {Usuario} = require('./usuario');
const {Categoria} = require('./categoria');
const {Movimiento} = require('./movimiento');

module.exports = {
    Bodega,    
    Categoria,
    Modelo,
    Producto,
    Rol,
    Usuario,
    Movimiento
};