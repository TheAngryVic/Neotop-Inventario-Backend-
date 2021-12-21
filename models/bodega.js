const {Schema, model} = require("mongoose");

const BodegaSchema = Schema({

    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        unique: true,
        
    },
    local:{
        type: String,
        required: [true, "La localización es obligatoria"]
    },
    estado:{
        type:Boolean,
        required: [true, "El estado es obligatorio"],
        default: true
    }

});



BodegaSchema.methods.toJSON = function(){

    //Separamos los datos que no queremos mostrar y el resto los agrupamos
    //En este caso no quiero mostrar la version ni la password
    const {__v,  _id ,...bodega} = this.toObject();

    bodega.uid = _id;

    return bodega 
}

module.exports = model("Bodega", BodegaSchema)