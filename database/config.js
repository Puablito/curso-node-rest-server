const mongoose = require('mongoose');

const dbConnection = async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true
    });

    console.log('base de datos Online');
  } catch (error) {
    console.log(error);
    throw new Error('Error al iniciar la DB');
  }
}


module.exports = {
  dbConnection
}