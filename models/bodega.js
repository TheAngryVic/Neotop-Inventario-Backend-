const {DataTypes} =require('sequelize')
const { db } = require('../DB/config')

const Bodega = db.define('Bodega',{

    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    local:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: true
    }, 
})


module.exports = {Bodega}

