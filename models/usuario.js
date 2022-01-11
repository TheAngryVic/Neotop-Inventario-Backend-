const {DataTypes} =require('sequelize')
const { db } = require('../DB/config')
const { Rol } = require('./role')

const Usuario = db.define('Usuario',{
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    correo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: true
    } 

})

Usuario.Rol = Usuario.belongsTo(Rol)

module.exports = {Usuario}