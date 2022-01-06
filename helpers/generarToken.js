const jwt = require("jsonwebtoken");

const generarJWT = (uid = "", nombre="", rol="") => {
  return new Promise((resolve, reject) => {
    const payload = { uid,nombre, rol };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar Token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { generarJWT };
