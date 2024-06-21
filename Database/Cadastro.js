const Sequelize = require('sequelize')
const connection = require('./Database')
const Cadastros = connection.define('cadastros', {

    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    FotoPerfil: {
        type: Sequelize.DataTypes.BLOB('long'),
        allownull: true
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
    },
    TipoConta: {
        type: Sequelize.STRING,
        allownull: false
    },
    Violao: {
        type: Sequelize.STRING,
        allownull: false
    },
    Teclado: {
        type: Sequelize.STRING,
        allownull: false
    },
    Baixo: {
        type: Sequelize.STRING,
        allownull: false
    },
    Mesa: {
        type: Sequelize.STRING,
        allownull: false
    },
    Bateria: {
        type: Sequelize.STRING,
        allownull: false
    }
})

Cadastros.sync({ force: false }).then(() => {
    console.log("Users table connected with success")
})

module.exports = Cadastros