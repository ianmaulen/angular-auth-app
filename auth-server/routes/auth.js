const Router = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// CREAR NUEVO USUARIO
router.post('/new', [
  check( 'name', 'el nombre obligatorio' ).not().isEmpty(),
  check( 'email', 'el email es obligatorio' ).isEmail(),
  check( 'password', 'el password es obligatorio' ).isLength({min: 6}),
  validarCampos
] , crearUsuario)

// LOGIN DE USUARIO
router.post('/', [
  check( 'email', 'el email es obligatorio' ).isEmail(),
  check( 'password', 'el password es obligatorio' ).isLength({min: 6}),
  validarCampos
] , loginUsuario)

// VALIDAR Y REVALIDAR TOKEN
router.get('/renew', validarJWT, revalidarToken)








module.exports = router;