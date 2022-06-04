const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next)=>{
  const token =  req.header("x-token");
  if(!token){
    return res.status(401).json({
      msg:'No hay un token en la petición'
    });
  }

  try {
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // retorna el payload
    const usuario = await Usuario.findById(uid);
    // El usuario no existe
    if( !usuario ){
      return res.status(401).json({
        msg:'Token no válido'
      });
    }

    // Verifica si usuario esta eliminado
    if( !usuario.estado ){
      return res.status(401).json({
        msg:'Token no válido'
      });
    }

    req.usuario = usuario;
    next();
    
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg:'Token no válido'
    });
  }


}

module.exports = {
  validarJWT
}