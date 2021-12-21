const { response } = require("express");
const { Categoria } = require("../models");

//obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario")
      .limit(Number(limite))
      .skip(Number(desde)),
  ]);

  res.json({
    total,
    categorias,
  });
};
//obtenerCategorias - populate  {}

const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;

  // const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  const categoria = await Categoria.find({ _id: id, estado: true }).populate(
    "usuario",
    "nombre"
  );

  res.json({ categoria });
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe en la DB`,
    });
  }

  //generar data
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  // Guardar en la base de datos

  await categoria.save();

  res.status(201).json(categoria);
};

//actualizar categoria

const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  if (data.nombre) {
    const existe = await Categoria.findOne({
      nombre: data.nombre.toUpperCase(),
    });

    if (existe) {
      return res
        .status(400)
        .json({ msg: `${data.nombre} ya existe en la base de datos` });
    }
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    categoria,
    msg: `Categoria ${categoria.nombre} actualizada`,
  });
};

//borrar categoria- estado:false

const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;
  data.estado = false;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    categoria,
    msg: `Categoria ${categoria.nombre} eliminado`,
  });
};

module.exports = {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
};
