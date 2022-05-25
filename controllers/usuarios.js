const { request ,response } = require('express'); // para tener el autocompletado y funciones.

const usuariosGet = (req = request, res = response) => {
  // http://localhost:8080/api/usuarios?q=hola&page=1&limt=100
  const {q, page = 1, limt} = req.query;

  res.json({
    msg:'get API - controlador',
    q, 
    page, 
    limt
  });
}
const usuariosPost = (req, res = response) => {
  const {nombre, edad} = req.body;

  res.json({
    msg:'post API - controlador',
    nombre, edad
  });
}
const usuariosPut = (req, res = response) => {
  // http://localhost:8080/api/usuarios/10
  const id = req.params.id;
  res.json({
    msg:'put API',
    id
  });
}
const usuariosPatch = (req, res = response) => {
  res.json({
    msg:'patch API - controlador'
  });
}
const usuariosDelete = (req, res = response) => {
  res.json({
    msg:'delete API - controlador'
  });
}
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}