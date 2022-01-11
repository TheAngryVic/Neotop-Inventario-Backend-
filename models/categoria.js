const {DataTypes} =require('sequelize')
const { db } = require('../DB/config')

const Categoria = db.define('Categoria',{

    nombre:{
      type:DataTypes.STRING,
      allowNull:false
    },
    estado:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue: true
  } 

})

module.exports = {Categoria}



