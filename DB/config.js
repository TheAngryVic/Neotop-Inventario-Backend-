const { Sequelize } = require('sequelize');

const db = new Sequelize('inventario','root','',{
    host: process.env.DB_URI,
    dialect: 'mysql',
    define: {
      timestamps: false
    },
  })

module.exports={
db
}

