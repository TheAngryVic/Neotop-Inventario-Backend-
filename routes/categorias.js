/**
 * Importaciones
 * * */
const { Router, response } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
  comboCategoria,
  cargaMasiva
} = require("../controllers");

const {
  existeCategoriaxID,
  existeCategoria,
} = require("../helpers/dbValidators");

const { validarJWT, validarCampos, bodegaRole } = require("../middlewares");

const router = Router();

/**
 *
 * {{url/api/categorias}}
 */

//Carga masiva

router.post("/masivo",[validarJWT, validarCampos] ,cargaMasiva);

//Obtener todas las categorias
router.get("/",[validarJWT, validarCampos] ,obtenerCategorias);

//Obetenr combo
router.get("/combo",[validarJWT, validarCampos] ,comboCategoria);

//Obtener una categoria por id
router.get(
  "/:id",
  [
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeCategoriaxID),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear categoria - privado- cualquier persona con token valido
router.post(
  "/",
  [
    validarJWT,
    bodegaRole,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar- privado - cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeCategoriaxID),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar categoria- privado- solo admin -
router.delete(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeCategoriaxID),
    validarCampos,
  ],
  borrarCategoria
);

//

module.exports = router;
