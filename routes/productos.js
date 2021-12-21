const { Router, response } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const { obtenerProductos, crearProducto, actualizarProducto, borrarProducto, obtenerProducto } = require("../controllers/productos");
const { existeCategoria, existeCategoriaxID, existeBodegaxID, existeModeloxID, existeSerie, existeProductoxID } = require("../helpers/dbValidators");
const { validarJWT, bodegaRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-Campos");



const router = Router();

/**
 *
 * {{url/api/productos}}
 */

//Obtener todas los productos
router.get("/", obtenerProductos);

//Obtener un producto por id
router.get(
  "/:id",
  [
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
    check("id").custom(existeProductoxID),
    validarCampos,
  ],
  obtenerProducto
);

//Crear producto - privado- bodega only
router.post(
  "/",
  [
    validarJWT,
    bodegaRole,
    check("modelo", "El modelo es obligatorio").not().isEmpty(),
    check("modelo","El modelo debe ser un id de Mongo valido").isMongoId(),
    check("modelo").custom(existeModeloxID),
    check("bodega", "La bodega es obligatoria").not().isEmpty(),
    check("bodega","La bodega debe ser un id de Mongo valido").isMongoId(),
    check("bodega").custom(existeBodegaxID),
    check("nSerie").not().isEmpty(),
    check("nSerie").custom(existeSerie),
    validarCampos,
  ],
  crearProducto
);

//Actualizar- privado - cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("modelo","El modelo debe ser un id de Mongo valido").optional().isMongoId(),
    check("modelo").optional().custom(existeModeloxID),
    check("bodega","La bodega debe ser un id de Mongo valido").optional().isMongoId(),
    check("bodega").optional().custom(existeBodegaxID),
    check("nSerie").optional().custom(existeSerie),
    validarCampos,
  ],
  actualizarProducto
);

// Borrar categoria- privado- solo admin -
router.delete(
  "/:id",
  [
    validarJWT,
    bodegaRole,
    check("id", "El id ingresado no es un id de mongo").isMongoId(),
    check("id").custom(existeProductoxID),
    validarCampos,
  ],
  borrarProducto
);

//

module.exports = router;
