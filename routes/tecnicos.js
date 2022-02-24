const { Router } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const {
    obtenerTecnicos, agregarTecnico, modificarTecnico, terminarTecnico
} = require("../controllers");
const { validarCampos, validarJWT } = require("../middlewares");
const { bodegaRole } = require("../middlewares");
const { existeTecnicoxID } = require("../helpers/dbValidators");

const router = Router();


//obtener todos los modelos
router.get("/", [validarJWT, validarCampos],obtenerTecnicos );


router.post("/", [validarJWT,
    check("cliente", "debe ingresar un cliente").notEmpty(),
    check("tecnico", "debe ingresar un tecnico").notEmpty(),
    check("diagnostico_entrada", "debe ingresar un tecnico").notEmpty(),
    validarCampos
],agregarTecnico );

router.put("/:id", [validarJWT,
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeTecnicoxID),
    check("cliente", "debe ingresar un cliente").notEmpty().optional(),
    check("tecnico", "debe ingresar un tecnico").notEmpty().optional(),
    check("diagnostico_entrada", "debe ingresar un tecnico").notEmpty().optional(),
    validarCampos
],modificarTecnico );

router.put("/completar/:id", [validarJWT,
    check("id", "No es un id valido").isNumeric(),
    check("id").custom(existeTecnicoxID),
    check("diagnostico_salida", "debe ingresar un diagnostico").notEmpty(),
    validarCampos
], terminarTecnico);



module.exports = router;
