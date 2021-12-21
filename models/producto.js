const {Schema, model} = require("mongoose");

const ProductoSchema = Schema({
    
    modelo: {
      type: Schema.Types.ObjectId,
      ref: "Modelo",
      required: true,
    },  
    estado: {
      type: Boolean,
      default: true,
      required: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    cliente:{
        type: String
    },     
    nSerie:{
        type: String,
        required: true,
        unique: true
    },     
    disponible: {
      type: Boolean,
      default: true,
    },
    fecha_ingreso:{
        type:Date,
        default: Date.now()
    },
    bodega:{
        type:Schema.Types.ObjectId,
        ref: "Bodega",
        required: true       
    }
  });


  ProductoSchema.methods.toJSON = function(){

    //Separamos los datos que no queremos mostrar y el resto los agrupamos
    //En este caso no quiero mostrar la version ni la password
    const {__v,  _id ,...producto} = this.toObject();
  
    producto.uid = _id;
  
    return producto 
  }

module.exports = model("Producto", ProductoSchema)