const Sequelize = require('sequelize')
const connection = new Sequelize('escalaico', 'root', 'admin',{
    host: 'localhost',
    dialect: 'mysql'
})

connection.authenticate()
    .then(() => {
        console.log("Database connected with SUCCESS!");
    })
    .catch((msgErr) => {
        console.log("Database connection ERROR:", msgErr);
    });

module.exports = connection