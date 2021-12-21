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

//Obtener todas las categorias
router.get("/", obtenerCategorias);

//Obtener una categoria por id
router.get(
  "/:id",
  [
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
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
    check("nombre").custom(existeCategoria),
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
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
    check("id").custom(existeCategoriaxID),
    check("nombre").custom(existeCategoria),
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
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
    check("id").custom(existeCategoriaxID),
    validarCampos,
  ],
  borrarCategoria
);

//

module.exports = router;
