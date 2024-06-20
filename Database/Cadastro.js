const Sequelize = require('sequelize')
const connection = require('./Database')
const Cadastros = connection.define('cadastros', {

    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    Token: {
        type: Sequelize.STRING,
        allownull: false
    },
    Email: {
        type: Sequelize.STRING,
        allownull: false
    },
    Senha: {
        type: Sequelize.STRING,
        allownull: false
    }
})

Cadastros.sync({ force: false }).then(() => {
    console.log("Users table connected with success")
})

module.exports = Cadastros