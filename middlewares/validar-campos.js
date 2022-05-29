const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next )=>{

  const errors = validationResult(req);
  if( !errors.isEmpty()){
    return res.status(400).json(errors);
  }

  next(); // indica que siga a otro middleware y si no hay mas que ejecute la función siguiente
}

module.exports = {
  validarCampos
}