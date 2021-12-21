const { response, request } = require("express");
const becrypter = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  //   const usuarios = await Usuario.find({estado: true})
  //   .limit(Number(limite))
  //   .skip(Number(desde));
  //   const total = await Usuario.countDocuments({estado: true});

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true }).limit(Number(limite)).skip(Number(desde)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Verificar si correo existe

  // Encriptar contraseña
  const salt = becrypter.genSaltSync();
  usuario.password = becrypter.hashSync(password, salt);

  //Guardar DB
  await usuario.save();
  res.json({
    msg: "post API - Controller",
    usuario,
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = becrypter.genSaltSync();
    resto.password = becrypter.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    usuario,
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch API - Controller",
  });
};

const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    const usuario_autenticado = req.usuario;


    //Fisicamente lo borramos
    // const usuario = await Usuario.findOneAndDelete(id);

    //Actualmente no es recomendado eliminar los registros, ahora se le cambia el estado

    const usuario_eliminado = await Usuario.findByIdAndUpdate(id, {estado: false});


  res.json({ 
    usuario_autenticado,
    usuario_eliminado
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
};
