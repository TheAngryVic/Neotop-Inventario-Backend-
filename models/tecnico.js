const sequelize = require('sequelize')
const {DataTypes} =require('sequelize')
const { db } = require('../DB/config')
const { Producto } = require("./producto");

const Tecnico = db.define('Tecnico',{
    cliente:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fecha_entrada:{
        type:DataTypes.DATEONLY,
        defaultValue:sequelize.NOW,
        allowNull:false
    }, 
    diagnostico_entrada:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    diagnostico_salida:{
        type:DataTypes.STRING,
        allowNull:true
    },
    tecnico:{
        type:DataTypes.STRING,
        allowNull:true
    },
    fecha_salida:{
        type:DataTypes.DATEONLY,
        allowNull:true
    } 

})

Tecnico.Producto = Tecnico.belongsTo(Producto);

module.exports = {Tecnico}