const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

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

const googleSignIn = async(req, res = response)=>{
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    
    let usuario = await Usuario.findOne({correo});

    if( !usuario ){
      // crea el usuario, al ser de google, los campos que no trae le pongo basura
      const data = {
        nombre,
        correo,
        rol:'USER_ROLE',
        password:':P',
        img,
        google: true
      }

      usuario = new Usuario( data );
      await usuario.save();
    }

    // Verifica estado del usuario en DB
    if( !usuario.estado ){
      return res.status(401).json({
        msg:'Hable con el administrador, usuario bloqueado',
      })
    }

    // Genera JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    res.status(400).json({
      ok:false,
      msg:'El token no se pudo verificar',
      error
    })
  }

}

module.exports = {
  login,
  googleSignIn
}