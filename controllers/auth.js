const { response } = require("express");
const { Usuario } = require("../models/usuario");
const bcrypter = require("bcryptjs");
const { generarJWT } = require("../helpers/generarToken");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {

    const usuario = await Usuario.findAll({
      where: { correo },
    })
      .then((user) => {
        if (user.length < 1) {
          console.log("Correo");
          return res.status(400).json({
            msg: "Usuario / Password no son correctos",
          });
        }

        if (!user[0].dataValues.estado) {
          return res.status(400).json({
            msg: "Usuario / Password no son correctos --estado: false ",
          });
        }

        const passValida = bcrypter.compareSync(
          password,
          user[0].dataValues.password
        );

        if (!passValida) {
          return res.status(400).json({
            msg: "Usuario / Password no son correctos --password ",
          });
        }

        /*** Por qué tengo que hacer el forzarToken dirás?
         * Por algun motivo no puedo usar el await dentro de una promesa
         * en este caso el then.
         * Así que creo una función que ejecuta la función del jwt
         * la cual es async()
         */
        let forzarToken = async()=>{
          const token = await generarJWT( user[0].dataValues.id, user[0].dataValues.nombre, user[0].dataValues.rol);
          
          res.status(200).json({token,user})
        }

        forzarToken();

      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          msg: error,
        });
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = { login };
