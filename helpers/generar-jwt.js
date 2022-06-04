const jwt = require('jsonwebtoken');


// jwt funciona con callback, se realiza esto para transformarlo a promesas que es como trabaja toda la app.
// El metodo sign devuelve un callback
const generarJWT = (uid = '')=>{
  return new Promise( (resolve, reject)=>{
    
    const  payload = { uid };

    jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
      expiresIn:'4h'
    }, (err, token)=>{
      if(err){
        console.log(err);
        reject('No se pudo generar el token');
      }else{
        resolve(token);
      }
    })
  });
}


module.exports = {
  generarJWT
}