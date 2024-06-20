const Sequelize = require('sequelize')
const connection = require('./Database')
const Escalas = connection.define('escalas', {
  Culto: {
    type: Sequelize.STRING,
    allownull: false
},
    DataCulto: {
        type: Sequelize.STRING,
        allownull: false
    },
    Teclado: {
      type: Sequelize.STRING,
      allownull: false 
  },
    Violao: {
        type: Sequelize.STRING,
        allownull: false
    },
    Baixo: {
        type: Sequelize.STRING,
        allownull: false
    }, 
    Bateria: {
      type: Sequelize.STRING,
      allownull: false
  },
  Mesa: {
    type: Sequelize.STRING,
    allownull: false
}
    
})

Escalas.sync({ force: false }).then(() => {
    console.log("Scale table connected with success")
})

module.exports = Escalas