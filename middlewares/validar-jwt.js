const { response } = require("express");
const jwt = require("jsonwebtoken");

//Tarea
const { Usuario } = require("../models/usuario");

const validarJWT = async (req, res = response, next) => {
  const token = req.header("x-token");

  //Verificar si existe token en la peticion
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //Tarea, traer al usuario autenticado
    const usuario = await Usuario.findByPk(uid).then((user) => {
      req.usuario = user;
      if (!user) {
        return res.status(401).json({
          msg: "Usuario no existe en la data base",
        });
      }
      //verificar si el User está activo
      if (!user.dataValues.estado) {
        return res.status(401).json({
          msg: "Token no valido- Usuario inactivo",
        });
      }

      next();
    });


  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
