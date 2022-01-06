const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypter = require("bcryptjs");
const { generarJWT } = require("../helpers/generarToken");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //verificar si el email existe

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos --correo ",
      });
    }

    //Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos --estado: false ",
      });
    }

    // verificar la contraseña
    const passValida = bcrypter.compareSync(password, usuario.password);

    if (!passValida) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos --password "
      });
    }

      //generar el JWT
    const token = await generarJWT( usuario.id, usuario.nombre, usuario.rol);


      res.json({
        token,
        usuario
      });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = { login };
