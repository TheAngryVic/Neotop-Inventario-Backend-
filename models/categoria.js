const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique:true
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
});


//Tiene que ser una funcion normal para poder usar el "this"
CategoriaSchema.methods.toJSON = function(){

  //Separamos los datos que no queremos mostrar y el resto los agrupamos
  //En este caso no quiero mostrar la version ni la password
  const {__v,  _id ,...categoria} = this.toObject();

  categoria.uid = _id;

  return categoria 
}

module.exports = model("Categoria", CategoriaSchema);
