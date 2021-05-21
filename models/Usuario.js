const { DataTypes } = require('sequelize');
const { db } = require('../database/config');




const Usuario = db.define('Users',{
    
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    updatedAt: {
        type: DataTypes.TIME
    }
    
     
});

const Profile = db.define('Profile',{
    profile: {
        type: DataTypes.STRING
    }
    
});

const user_profile = db.define('user_profile',{
    user_id: {
        type: DataTypes.INTEGER
    },
    profile_id: {
        type: DataTypes.INTEGER
    }
    
});

module.exports = {
    Usuario,
    Profile,
    user_profile
};

