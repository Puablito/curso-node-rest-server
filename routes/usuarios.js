const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, esAdminRole, tieneRol} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPost, usuariosDelete, usuariosPut, usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

// segun documentacion (https://express-validator.github.io/docs/check-api.html)
// Se recomienda no usar check sino los otros metodos, ya que check verifica en el body, header, etc. Y puede que uno espere
// los parametros en body y se los manden en el header y los recupera el check, ver preguntas en video 145 curso node 

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
  validarJWT,
  // esAdminRole,
  tieneRol('ADMIN_ROLE','VENTAS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;