const { Categoria, Role, Modelo, Bodega, Producto } = require("../models");
const Usuario = require("../models/usuario");


const rolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(` El rol  ${rol} no está registrado en la BD`);
  }
};

//Tarea correo

const existeEmail = async (correo = "")=>{

    const existencia = await Usuario.findOne({correo});
    if (existencia) {
        throw new Error('El correo ya está registrado')
    }
}


const existeUsuarioxID = async (id = "")=>{

    const existencia = await Usuario.findById(id);
    if (!existencia) {
        throw new Error(`El ID: ${id}, no existe`);
    }
}

//Categorias

const existeCategoriaxID = async (id = "")=>{

    const existencia = await Categoria.findById(id);
    if (!existencia) {
        throw new Error(`El ID: ${id}, no existe`);
    }
}

const existeCategoria = async (nombre = "")=>{

    const existencia = await Categoria.findOne({nombre});

    console.log(existencia)
    if (existencia) {
        throw new Error(`${nombre} ya existe como categoria`);
    }
}

//Modelo

const existeModeloxID = async (id = "")=>{

    const existencia = await Modelo.findById(id);
    if (!existencia) {
        throw new Error(`El ID: ${id}, no existe`);
    }
}

const existeModelo = async (nombre = "")=>{

    const existencia = await Modelo.findOne({nombre});
    if (existencia) {
        throw new Error(`${nombre} ya existe como categoria`);
    }
}



//bodega

const existeBodegaxID = async (id = "")=>{

    const existencia = await Bodega.findById(id, {estado: true});
    if (!existencia) {
        throw new Error(`El ID: ${id}, no existe`);
    }
}

const existeBodega = async (nombre = "")=>{

    const existe = await Bodega.findOne({nombre});

    if (existe) {
        throw new Error(`La bodega ${nombre} ya existe`);
    }
}


//Producto nSerie

const existeSerie = async (nSerie = "")=>{
      //Preguntar por nSerie 
  const existe = await Producto.findOne({nSerie})
  
  if (existe) {
    throw new Error(`La serie ${nSerie} ya existe en la base de datos`);
}
}

const existeProductoxID = async (id = "")=>{

    const existencia = await Producto.findById(id, {estado: true});
    if (!existencia) {
        throw new Error(`El ID: ${id}, no existe`);
    }
}


module.exports ={
    rolValido,
    existeEmail,
    existeUsuarioxID,
    existeCategoriaxID ,
    existeCategoria,
    existeModeloxID,
    existeModelo,
    existeBodegaxID,
    existeBodega,
    existeSerie,
    existeProductoxID
}