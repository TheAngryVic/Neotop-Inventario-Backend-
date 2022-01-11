const {DataTypes} =require('sequelize')
const { db } = require('../DB/config')
const { Categoria } = require('./categoria')

const Modelo = db.define('Modelo',
{
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: true
    }, 
    stock_minimo:{
        type:DataTypes.INTEGER,
        allowNull:false
    }, 
})

Modelo.Categoria = Modelo.belongsTo(Categoria)

module.exports = {Modelo}

