//const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');


const db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

const dbConnection = async() => {

    try {
        
        await db.authenticate();
        console.log('DB Online menol');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }


}


module.exports = {
    dbConnection,
    db
}