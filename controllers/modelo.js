const { response } = require("express");
const bcrypter = require("bcryptjs");
const { Modelo } = require("../models");


//pagination
const { calculateLimitAndOffset, paginate } = require("paginate-info");

//CRUD modelo

//Obtener todos los modelos - autenticado - todos los permisos

const obtenerModelos = async (req, res = response) => {

  const  {currentPage, pageSize,  ad = '1'} = req.query;

  try {

    const count = await Modelo.countDocuments({estado:true});

    const {limit, offset} = calculateLimitAndOffset(currentPage, pageSize);

    const rows = await Modelo.find({estado:true})
                             .populate("usuario")
                             .populate("categoria", "nombre")
                             .sort({nombre:ad})
                             .skip(offset)
                             .limit(limit);

    const meta = paginate(currentPage, count, rows, pageSize);

    return res.status(200).json({
      rows,
      meta
    })

  } catch (error) {
    console.log(error);
  }


  // const { limite = 5, desde = 0 } = req.query;

  // const [total, modelos] = await Promise.all([
  //   Modelo.countDocuments({ estado: true }),
  //   Modelo.find({ estado: true })
  //     .populate("usuario", "nombre")
  //     .populate("categoria", "nombre")
  //     .limit(Number(limite))
  //     .skip(Number(desde)),
  // ]);

  // res.json({
  //   total,
  //   modelos,
  // });
};

//Obtener modelo por id - autenticado - todos los permisos

const obtenerModelo = async (req, res = response) => {
  const { id } = req.params;

  const modelo = await Modelo.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.status(200).json({ modelo });
};

//Crear modelos - autenticado - bodega solo

const crearModelos = async (req, res = response) => {
  //Recuperamos el nombre del body y lo guardaremos en mayusculas
  const nombre = req.body.nombre.toUpperCase();

  //Verificaremos si existe modelo en la DB
  const modeloDB = await Modelo.findOne({ nombre });

  if (modeloDB) {
    return res.status(403).json({
      msg: "El modelo ingresado ya existe en la base de datos",
    });
  }

  //Genero data

  const data = req.body;

  data.nombre = nombre;
  data.usuario = req.usuario._id;

  const modelo = new Modelo(data);

  await modelo.save();

  res.status(201).json(modelo);
};

//Actualizar modelos - autenticado - bodega solo

const actualizarModelos = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const modelo = await Modelo.findByIdAndUpdate(id, data, { new: true })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.status(200).json({ modelo });
};

//borrar modelos - autenticado - bodega solo

const borrarModelos = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;
  data.estado = false;

  const modelo = await Modelo.findByIdAndUpdate(id, data, { new: true })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.status(200).json({ modelo });
};

module.exports = {
  actualizarModelos,
  borrarModelos,
  crearModelos,
  obtenerModelos,
  obtenerModelo,
};
