const { request ,response } = require('express'); // para tener el autocompletado y funciones.
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
  // http://localhost:8080/api/usuarios?q=hola&page=1&limt=100
  // const {q, page = 1, limt} = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = {estado:true};
  
  // Si se envian las 2 consultas con await, primero se resuelve una y luego la otra cuando se podrian resolver en paralelo y,
  // ahorrar tiempo de consulta, para ello se usa el promise all
  // const usuarios = await Usuario.find( query )
  //   .skip(Number(desde))
  //   .limit(Number(limite));
  // const total =  await Usuario.countDocuments( query );

  // Se le envia una coleccion de promesas a evaluar en paralelo, si una da error, devuelve error directamente
  // la desestructuración es en orden como escribi las promesas, no importa quien termina primero
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments( query ),
    Usuario.find( query )
      .skip(Number(desde))
      .limit(Number(limite))
  ])

  res.json({
    total,
    usuarios
  });
}

const usuariosPost = async(req, res = response) => {

  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario( {nombre, correo, password, rol} );
  
  // Encriptar contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync( password, salt );

  // Guardar en DB
  await usuario.save();

  // Devuelve datos al front
  res.json({
    usuario
  });
}

const usuariosPut = async(req, res = response) => {
  // http://localhost:8080/api/usuarios/10
  const {id} = req.params;
  const {_id, password, google, correo, ...resto} = req.body;

  if( password ){
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync( password, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    usuario
  });
}
const usuariosPatch = (req, res = response) => {
  res.json({
    msg:'patch API - controlador'
  });
}
const usuariosDelete = async(req, res = response) => {
  const { id } = req.params;
  // Borrado fisico
  // const usuario = await Usuario.findByIdAndDelete( id );
  
  // Borrado Logico
  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false} );

  res.json({
    id
  });
}
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}