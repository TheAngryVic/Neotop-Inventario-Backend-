const { Router } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const {
  crearModelos,
  obtenerModelos,
  obtenerModelo,
  actualizarModelos,
  borrarModelos,
  comboModelo,
  cargaMasivaModelo
} = require("../controllers");
const { validarCampos, validarJWT } = require("../middlewares");
const { bodegaRole } = require("../middlewares");
const {
  existeModeloxID,
  existeCategoriaxID,
} = require("../helpers/dbValidators");

const router = Router();

router.post('/masivo',[validarJWT, bodegaRole, validarCampos], cargaMasivaModelo)

//obtener todos los modelos
router.get("/", [validarJWT, validarCampos], obtenerModelos);

//Obetenr combo
router.get("/combo",[validarJWT, validarCampos] ,comboModelo);


//obteber modelo por id
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isNumeric(),
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
    check("categoria", "Categoria No es un id valido").isNumeric(),
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
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeModeloxID),
    check("categoria", "Categoria no es un id valido").optional().isNumeric(),
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
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeModeloxID),
    validarCampos
  ],
  borrarModelos
);

module.exports = router;
