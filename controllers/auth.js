const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response)=>{
  const {correo, password} = req.body;

  try {
    // Verifica el Email
    const usuario = await Usuario.findOne({ correo });
    if( !usuario ){
      return res.status(400).json({
        msg:'Usuario / Password no son correctos.'
      });
    }
    // Verifica si el Usuario está activo
    if( !usuario.estado ){
      return res.status(400).json({
        msg:'Usuario / Password no son correctos.'
      });
    }
    // Verifica password
    const validPassword = bcrypt.compareSync( password, usuario.password );
    if( ! validPassword ){
      return res.status(400).json({
        msg:'Usuario / Password no son correctos.'
      });
    }
    // Genera JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Ups! Algo salió mal, Hable con el admin'
    });
  }
}

module.exports = {
  login
}