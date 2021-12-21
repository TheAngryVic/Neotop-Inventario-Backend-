const { response } = require("express");
const jwt = require("jsonwebtoken");

//Tarea
const Usuario = require("../models/usuario");

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
    const usuario = await Usuario.findById(uid);
    req.usuario = usuario;

    //Verificar si el User existe

    if (!usuario) {
        
        return res.status(401).json({
            msg: "Usuario no existe en la data base"
        })
    }

    //verificar si el User está activo
    if (!usuario.estado) {
        return res.status(401).json({
            msg: "Token no valido- Usuario inactivo" 
        })
    }

    next();
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
