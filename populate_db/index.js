const mongoose = require('mongoose');
  
// Database connection
mongoose.connect(
    "mongodb://localhost:27017/tfgdb", 
    { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true  }
);
  
const Brand = require('../src/models/Brand')

  
// Function call
Brand.insertMany([
    { name: "Kawasaki", models: [
            {name: "z250"},
            {name: "z800"},
            {name: "ninja 125"},
            {name: "er6-f"},
        ]
    },
    { name: "Ducati", models: [
            {name: "Panigale V4"},
            {name: "Supersport"},
            {name: "Multistrada 950"},
            {name: "Multistrada 1260"},
        ] 
    },
    { name: "KTM", models: [
            {name: "Duke 125"},
            {name: "Duke 200"},
            {name: "RC 200"},
            {name: "RC 390"},
        ] 
    },

]).then(function(){
    console.log("Brands inserted")  // Succes
    mongoose.connection.close()
}).catch(function(error){
    console.log(error)      // Failure
});

