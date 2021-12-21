const { Router } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const {
  crearModelos,
  obtenerModelos,
  obtenerModelo,
  actualizarModelos,
  borrarModelos,
} = require("../controllers");
const { validarCampos, validarJWT } = require("../middlewares");
const { bodegaRole } = require("../middlewares");
const {
  existeModeloxID,
  existeCategoriaxID,
} = require("../helpers/dbValidators");

const router = Router();

//obtener todos los modelos
router.get("/", [validarJWT, validarCampos], obtenerModelos);

//obteber modelo por id
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "EL id ingresado no es un id valido"),
    check("id").custom(existeModeloxID),
    validarCampos,
  ],
  obtenerModelo
);

//Crear modelos
router.post(
  "/",
  [
    validarJWT,
    bodegaRole,
    check("nombre", "Debe ingresar un nombre").not().isEmpty(),
    check("categoria", "Categoria no es un id valido").isMongoId(),
    check("categoria").custom(existeCategoriaxID),
    check("stock_minimo").optional().isNumeric(),
    validarCampos,
  ],
  crearModelos
);

//Actualizar modelos
router.put(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
    check("id").custom(existeModeloxID),
    check("categoria", "Categoria no es un id valido").optional().isMongoId(),
    check("categoria").optional().custom(existeCategoriaxID),
    check("stock_minimo").optional().isNumeric(),
    validarCampos
  ],
  actualizarModelos
);

//Borrar modelos
router.delete(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
    check("id").custom(existeModeloxID),
    validarCampos
  ],
  borrarModelos
);

module.exports = router;
