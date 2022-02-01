const { Sequelize } = require('sequelize');

const db = new Sequelize('inventario','root','',{
    host: 'localhost',
    dialect: 'mysql',
    define: {
      timestamps: false
    },
  })

module.exports={
db
}

// const mongoose = require('mongoose');

// const dbConnection = async() =>{

//     try {
        
//         await mongoose.connect( process.env.MONGODB_CNN, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         console.log('Base de datos conectada');

//     } catch (error) {
//         console.log(error)
//         throw new Error('Error al conectar con la base de datos ')    }
// }

// module.exports={
//     dbConnection
// }