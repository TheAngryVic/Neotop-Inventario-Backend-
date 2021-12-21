const { Router } = require("express");
const { check } = require("express-validator"); //MIddleware de ExpressValidator
const { login } = require("../controllers");
const { validarCampos } = require("../middlewares/validar-Campos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La password es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
