const { Router } = require("express");

const { check } = require("express-validator"); //MIddleware de ExpressValidator

//Middlewares personalizados
const {
  validarJWT,
  validarCampos,
  adminRole,
  tieneRole,
} = require("../middlewares");

const {
  rolValido,
  existeEmail,
  existeUsuarioxID,
} = require("../helpers/dbValidators");

const {
  usuariosGet,
  usuariosDelete,
  usuariosPatch,
  usuariosPut,
  usuariosPost,
} = require("../controllers/");

const router = Router();

router.get("/", usuariosGet);

router.post(
  "/",
  [
    check("nombre", "Nombre no es valido").not().isEmpty(),
    check("password", "La contraseña debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "Correo no es valido").isEmail(),
    check("correo").custom(existeEmail),
    //check('rol', 'No es un rol permitido').isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(rolValido),
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioxID),
    check("rol").custom(rolValido),
    validarCampos,
  ],
  usuariosPut
);

router.patch("/", usuariosPatch);

router.delete(
  "/:id",
  [
    validarJWT,
    // adminRole,
    tieneRole("VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioxID),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
