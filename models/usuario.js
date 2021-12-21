

const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required: [true, 'El nombre es obligatiorio'],
        
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatiorio'],
        unique: true

    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatioria'],
        
    },
    img:{
        type: String,
        
    },
    rol:{
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'BODEGA_ROLE', 'MANTENCION_ROLE','USER_ROLE'] 
    },
    estado:{
        type: Boolean,
        default : true
    }, 
    

});

//Tiene que ser una funcion normal para poder usar el "this"
UsuarioSchema.methods.toJSON = function(){

    //Separamos los datos que no queremos mostrar y el resto los agrupamos
    //En este caso no quiero mostrar la version ni la password
    const {__v, password, _id ,...usuario} = this.toObject();

    usuario.uid = _id;

    return usuario 
}

module.exports = model('Usuario', UsuarioSchema);