//const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');


const db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

const dbSql = new Sequelize(process.env.DB2, process.env.DB_USER2, process.env.DB_PASS2, {
    host: process.env.DB_HOST2,
    dialect: 'mssql',
        dialectOptions: {
            encrypt: true
        }
});

const dbConnection = async() => {

    try {
        
        await db.authenticate();
        // await dbSql.authenticate();
        console.log('DB Online menol'); 

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }


}


module.exports = {
    dbConnection,
    db,
    dbSql
}