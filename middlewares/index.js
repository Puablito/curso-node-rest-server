// se unifican los require para que en la importacion quede mas lindo y comodo

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validaRoles
}