const { response } = require("express");
const { rawListeners } = require("../models/usuario");

const adminRole = async (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar rol sin validar Token primero",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: ` ${nombre} no es un Administrador - No puede hacer esto`,
    });
  }

  next();
};

const bodegaRole = async (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar rol sin validar Token primero",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "BODEGA_ROLE") {
    return res.status(401).json({
      msg: ` ${nombre} no es un BODEGA - No puede hacer esto`,
    });
  }

  next();
};


const tieneRole = (...roles)=>{

    return (req, res = response, next)=>{

        if (!req.usuario) {
            return res.status(500).json({
              msg: "Se quiere verificar rol sin validar Token primero",
            });
        }

        const {rol, nombre} =req.usuario;

        console.log(rol)
        console.log("esto es roles_ "+ roles)
        
        if (!roles.includes(rol)) {

            return res.status(401).json({
                msg: `${nombre} no cumple con el rol requerido para hacer esta función`
            })
            
        }

        next();

    }

}



module.exports = {
  adminRole,
  tieneRole,
  bodegaRole
};
