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

router.get("/", [
  validarJWT,
  adminRole
],usuariosGet);

router.post(
  "/iniciando",
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
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "Nombre no es valido").not().isEmpty(),
    check("password", "La contraseña debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "Correo no es valido").isEmail(),
    check("correo").custom(existeEmail),
    //check('rol', 'No es un rol permitido').isIn(["ADMIN_ROLE", "USER_ROLE"]),
    adminRole,
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeUsuarioxID),
    check("rol").custom(rolValido),
    adminRole,
    validarCampos,
  ],
  usuariosPut
);


router.delete(
  "/:id",
  [validarJWT,
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeUsuarioxID),
    adminRole,
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
