const { DataTypes } = require('sequelize');
const { db } = require('../database/config');




const Call = db.define('Call',{
    
    tipo_solicitud: {
        type: DataTypes.STRING
    },
    tipo_llamada: {
        type: DataTypes.STRING
    },
    num_rif_ci: {
        type: DataTypes.STRING
    },
    nombre_cliente: {
        type: DataTypes.STRING
    },
    direccion: {
        type: DataTypes.STRING
    },
    id_user: {
        type: DataTypes.STRING
    },
    nombre_user: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    },
    updatedAt: {
        type: DataTypes.TIME
    },
   
     
});

const Client = db.define('client',{
    
    name: {
        type: DataTypes.STRING
    },
    ci_rif: {
        type: DataTypes.INTEGER
    },
    phone: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    updatedAt: {
        type: DataTypes.TIME
    },
   
     
});

const Request = db.define('request',{
    
    request: {
        type: DataTypes.STRING
    }
     
});

const TypeRequest = db.define('type_request',{
    
    request_id: {
        type: DataTypes.INTEGER
    },
    type_request: {
        type: DataTypes.STRING
    }
     
});




module.exports = {
    Call,
    Client,
    Request,
    TypeRequest
};

