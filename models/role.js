const {DataTypes} =require('sequelize')
const { db } = require('../DB/config')

const Rol = db.define('Rol',{
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    } 

})

module.exports = {Rol}