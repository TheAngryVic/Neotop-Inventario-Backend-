const { DataTypes } = require("sequelize");
const { db } = require("../DB/config");
const { Modelo } = require("./modelo");
const { Usuario } = require("./usuario");
const { Bodega } = require("./bodega");

const Producto = db.define("Producto", {
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nSerie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


Producto.Modelo = Producto.belongsTo(Modelo);
Producto.Bodega = Producto.belongsTo(Bodega);
Producto.Usuario = Producto.belongsTo(Usuario);

module.exports = {Producto}
