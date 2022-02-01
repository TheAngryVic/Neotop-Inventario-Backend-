const sequelize = require('sequelize')
const {DataTypes} =require('sequelize')
const { Producto } = require('./producto')
const { Usuario } = require('./usuario')
const { db } = require('../DB/config')

const Movimiento = db.define('Movimiento',
{
    local_original:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue: 'ingresado'
    }, 
    local_nuevo:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    fecha:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        defaultValue:sequelize.NOW
    } 
})

Movimiento.Producto = Movimiento.belongsTo(Producto)
Movimiento.Usuario = Movimiento.belongsTo(Usuario)

module.exports = {Movimiento}

