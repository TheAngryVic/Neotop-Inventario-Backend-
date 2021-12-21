const {Schema, model} = require("mongoose");

const ModeloSchema = Schema({

    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    categoria: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Categoria"
    },    
    estado: {
        type: Boolean,
        default:true,
    },
    stock_minimo:{
        type: Number,
        default:0,
        required: true        
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:"Usuario",
        required: true
    },
    
});

ModeloSchema.methods.toJSON = function(){

    //Separamos los datos que no queremos mostrar y el resto los agrupamos
    //En este caso no quiero mostrar la version ni la password
    const {__v,  _id ,...modelo} = this.toObject();
  
    modelo.uid = _id;
  
    return modelo 
  }

module.exports = model("Modelo", ModeloSchema)