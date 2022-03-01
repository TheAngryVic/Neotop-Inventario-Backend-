const { Sequelize } = require('sequelize');

const db = new Sequelize('inventario',process.env.DB_User,process.env.Db_pass,{
    host: process.env.DB_URI,
    dialect: 'mysql',
    define: {
      timestamps: false
    },
  })

module.exports={
db
}

