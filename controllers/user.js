const { response, request } = require("express");
const becrypter = require("bcryptjs");
const { Usuario } = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  await Usuario.findAndCountAll({
    where: { estado: true },
  })
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  let role;

  switch (rol) {
    case "ADMIN_ROLE":
      role = 1;

      break;
    case "BODEGA_ROLE":
      role = 2;

      break;
    case "SERVICIO_ROLE":
      role = 3;

      break;
    case "USER_ROLE":
      role = 4;

      break;
  }

  const data = {
    nombre,
    correo,
    password,
    RolId: role,
  };
  // Encriptar contraseña
  const salt = becrypter.genSaltSync();
  data.password = becrypter.hashSync(password, salt);
  //Guardar DB
  const usuario = new Usuario(data);
  await usuario.save();
  res.status(200).json({
    msg: `Usuario: ${nombre} creado con exito`,
    usuario,
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, rol, correo, ...resto } = req.body;
  let role;

  if (password) {
    const salt = becrypter.genSaltSync();
    resto.password = becrypter.hashSync(password, salt);
  }

  if (rol) {
    switch (rol) {
      case "ADMIN_ROLE":
        role = 1;
        resto.RolId = role
  
        break;
      case "BODEGA_ROLE":
        role = 2;
        resto.RolId = role

  
        break;
      case "SERVICIO_ROLE":
        role = 3;
        resto.RolId = role

  
        break;
      case "USER_ROLE":
        role = 4;
        resto.RolId = role 
        break;
    }
    
  }

  const usuario = await Usuario.update(
    {resto},{where:{id}}
  )

  res.json({
    usuario,
  });
};


const usuariosDelete = async (req, res) => {
  const { id } = req.params;

  const usuario_autenticado = req.usuario;

  //Fisicamente lo borramos
  // const usuario = await Usuario.findOneAndDelete(id);

  //Actualmente no es recomendado eliminar los registros, ahora se le cambia el estado

  const usuario = await Usuario.update(
    {estado:false},{where:{id}}
  )

  res.json({
    usuario_autenticado,
    usuario,
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
