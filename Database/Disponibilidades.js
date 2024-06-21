const Sequelize = require('sequelize')
const connection = require('./Database')
const Disponibilidades = connection.define('disponiblidades', {
  IdCadastro: {
    type: Sequelize.STRING,
    allownull: false
},
    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    Mes: {
      type: Sequelize.STRING,
      allownull: false
  },
    CultoLibertacao: {
        type: Sequelize.STRING,
        allownull: false
    },
    CultoFamilia: {
        type: Sequelize.STRING,
        allownull: false
    }, 
    CultoAdoracaoManha: { 
      type: Sequelize.STRING,
      allownull: false
  },
  CultoAdoracaoNoite: {
    type: Sequelize.STRING,
    allownull: false
},
 Status: {
  type: Sequelize.STRING,
  allownull: false
},
    
})

Disponibilidades.sync({ force: false }).then(() => {
    console.log("Disponiblity table connected with success")
})

module.exports = Disponibilidades