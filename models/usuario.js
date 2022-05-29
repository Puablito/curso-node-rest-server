
const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
  nombre:{
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  correo:{
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  password:{
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img:{
    type: String,
  },
  rol:{
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  estado:{
    type: Boolean,
    default: true
  },
  google:{
    type: Boolean,
    default: false
  }
});

// tiene que ser una funcion normal porque se va a utilizar el this
// Se sobreescribe el metodo para devolver la info que desamos
UsuarioSchema.methods.toJSON = function(){
  const {__v, password, ...usuario} = this.toObject(); // todo el resto de parametros se guarda en usuario
  return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema);