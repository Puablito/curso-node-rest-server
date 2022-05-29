const { Router } = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { usuariosGet, usuariosPost, usuariosDelete, usuariosPut, usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  check('rol').custom( esRoleValido ),
  validarCampos
], usuariosPut);

// el parametro del medio se usa para indicar los middleware a ejecutar antes de llamar a la funcion "usuariosPost"
router.post('/',[ 
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe de ser de más de 6 letras').isLength({min:6}),
  check('correo').custom( emailExiste ),
  // check('correo', 'El correo no es válido').isEmail(),
  // El rol que se pasa por parametro es elq ue se envia en la request
  check('rol').custom( esRoleValido ),  // es lo qmismo que (rol) => esRoleValido(rol), si solo se manda 1 parametro
  // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
  validarCampos
], usuariosPost);

router.delete('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;