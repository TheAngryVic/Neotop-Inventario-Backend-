const { Router } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const { obtenerMovimientos } = require("../controllers/movimiento");
const { validarJWT } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-Campos");

const router = Router();

//GET
router.get("/", [validarJWT, validarCampos], obtenerMovimientos);

module.exports = router;
