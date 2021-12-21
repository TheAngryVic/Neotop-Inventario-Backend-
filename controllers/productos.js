const { response } = require("express");
const { Categoria, Producto } = require("../models");

const ObjectId = require('mongodb').ObjectId;

//obtenerProductos - paginado - total - populate

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .populate("usuario", "nombre")
      .populate("modelo", "nombre")
      .populate("bodega", "nombre")
      .limit(Number(limite))
      .skip(Number(desde)),
  ]);

  res.json({
    total,
    productos,
  });
};
//obtenerProducto - populate  {}

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
  .populate("usuario", "nombre")
  .populate("modelo", "nombre")
  .populate("bodega", "nombre");

  res.json({ producto });
};

const crearProducto = async (req, res = response) => {

  const {usuario, ...data} = req.body; 

  
  
  
  //generar data
  
  data.usuario = req.usuario._id;
  
  const producto = new Producto(data);
  
  
  // Guardar en la base de datos
  await producto.save();

  res.status(201).json(producto);
};

//actualizar categoria

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado,usuario , fecha_ingreso,...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  data.usuario =  req.usuario._id;

  data.modelo = ObjectId(data.modelo)

  console.log(data)

  const producto = await Producto.findByIdAndUpdate(id, data,{new:true});

  res.status(200).json({
    producto
  });
};

//borrar categoria- estado:false

const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado,usuario, ...data } = req.body;
  
    data.usuario =  req.usuario._id;
    data.estado = false  
  
    const producto = await Producto.findByIdAndUpdate(id, data, {new:true})
    .populate("usuario", "nombre")
    .populate("modelo", "nombre")
    .populate("bodega", "nombre");
  
    res.status(200).json({
      producto,
      msg: `Producto ${producto.modelo.nombre} N°: ${producto.nSerie} eliminado`,
    });
  };

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
};
