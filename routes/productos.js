const { Router, response } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const { obtenerProductos, crearProducto, actualizarProducto, borrarProducto, obtenerProducto, obetenerInventario, cargaMasivaProducto, selectProducto } = require("../controllers/productos");
const { existeCategoria, existeCategoriaxID, existeBodegaxID, existeModeloxID, existeSerie, existeProductoxID } = require("../helpers/dbValidators");
const { validarJWT, bodegaRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-Campos");



const router = Router();

/**
 *
 * {{url/api/productos}}
 */


//Carga masiva
router.post('/masivo',[validarJWT, bodegaRole, validarCampos], cargaMasivaProducto)

//Obtener todas los productos
router.get("/",[validarJWT, validarCampos] ,obtenerProductos);

router.get("/select",[validarJWT, validarCampos] ,selectProducto);


router.get("/inventario",[validarJWT, validarCampos] ,obetenerInventario);

//Obtener un producto por id
router.get(
  "/:id",
  [ validarJWT,
    check("id", "No es un id valido").isNumeric(),
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
    check("modelo","No es un id valido").isNumeric(),
    check("modelo").custom(existeModeloxID),
    check("bodega", "La bodega es obligatoria").not().isEmpty(),
    check("bodega","No es un id valido").isNumeric(),
    check("bodega").custom(existeBodegaxID),
    check("nSerie").not().isEmpty(),
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
    check("modelo","El modelo No es un id valido").optional().isNumeric(),
    check("modelo").optional().custom(existeModeloxID),
    check("bodega","La bodega No es un id valido").optional().isNumeric(),
    check("bodega").optional().custom(existeBodegaxID),
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
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeProductoxID),
    validarCampos,
  ],
  borrarProducto
);

//

module.exports = router;
