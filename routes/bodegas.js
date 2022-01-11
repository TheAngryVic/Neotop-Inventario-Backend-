const { Router, response } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const {
  obtenerBodegas,
  obtenerBodega,
  actualizarBodega,
  borrarBodega,
  crearBodega,
  comboBodega
} = require("../controllers");
const { existeBodegaxID, existeBodega } = require("../helpers/dbValidators");
const { validarJWT, bodegaRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-Campos");

const router = Router();

//Get todos
router.get("/", [validarJWT, validarCampos], obtenerBodegas);

//Obetenr combo
router.get("/combo",[validarJWT, validarCampos] ,comboBodega);


//Get x id
router.get(
  "/:id",
  [
    validarJWT,
    check("id").custom(existeBodegaxID),
    validarCampos,
  ],
  obtenerBodega
);

//Crear
router.post(
  "/",
  [
    validarJWT,
    bodegaRole,
    check("nombre", "Debe ingresar un nombre").not().isEmpty(),
    check("local", "Debe ingresar una localización").not().isEmpty(),
    validarCampos
  ],
  crearBodega
);

//actualizar
router.put(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "No es una id de mongo valido").isMongoId(),
    check("id").custom(existeBodegaxID),
    validarCampos,
  ],
  actualizarBodega
);

//borrar
router.delete(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "No es una id de mongo valido").isMongoId(),
    check("id").custom(existeBodegaxID),
  ],
  borrarBodega
);

module.exports = router;
