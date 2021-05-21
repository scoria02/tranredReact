const { response } = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../database/config');
const { Op , QueryTypes} = require('sequelize');
const { generarJWT } = require('../helpers/jwt');
const  { Usuario, Profile }  = require('../models/Usuario');
 
const crearUsuario = async(req, res = response ) => {

    const { email, password } = req.body;
    console.log(req.body);

    try {
        let usuario = await Usuario.findOne({
            where: {
                email: email 
            }
        });

        
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // console.log(usuario)
        await usuario.save();

        // revisa el perfil que tenga
        let profile = await db.query(`SELECT profile FROM user_profiles 
        INNER JOIN users ON user_profiles.user_id = users.id
        INNER JOIN profiles ON user_profiles.profile_id = profiles.id
        WHERE user_id = $id`, {
        type: QueryTypes.SELECT,
        bind: {
            id: usuario.id
         }});

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
        
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            profile,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador loco'
        });
    }
}

const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;
    // console.log(email, password);
    try {
        // const usuario = await Usuario.findOne({ email });
        let usuario = await Usuario.findOne({
            where: {
                email: email,
            }
        });

        let profile = await db.query(`SELECT profile FROM user_profiles 
        INNER JOIN users ON user_profiles.user_id = users.id
        INNER JOIN profiles ON user_profiles.profile_id = profiles.id
        WHERE user_id = $id`, {
        type: QueryTypes.SELECT,
        bind: {
            id: usuario.id
         }});

        
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            email: usuario.email,
            name: usuario.name,
            profile,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;
    //console.log(req.body)
    // Generar JWT
    let usuario = await Usuario.findOne({
        where: {
            id: uid 
        }
    });
    let { email }= usuario;
    let profile = await db.query(`SELECT profile FROM profiles WHERE id IN 
        (SELECT profile_id FROM user_profiles WHERE user_id = $id)`, {
        type: QueryTypes.SELECT,
        bind: {
            id: usuario.id
         }});
    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token,
        uid,
        name,
        email,
        profile,
    })
}

const getUsuarios = async (req, res = response ) => {

    const usuarios = await Usuario.findAll();
    res.json( { usuarios } )
}

const getProfile = async (req, res = response ) => {

    const profile = await Profile.findAll();
    res.json( { profile } );
}

const getUsuario = async (req, res = response ) => {

    const { email } = req.params;
    
        let userControl = await Users.findOne({
            where: {
                email: email 
            }
        });
        
        if (!userControl) {
            return res.status(404).json({
                msg: 'El usuario no existe'
            })
        }
    
        res.json({
            ok: true,
            userControl,
            msg: 'Perfect usuario'
        });

    
   
}

const putUsuario = async (req, res = response ) => {
    
    const { id } = req.params;
    const { body} = req;
    

    try {
        
        let usuario = await Users.findByPk(id);
        
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        
        await usuario.update(body);

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.nombre,
            estatus: usuario.estatus,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    getUsuarios,
    getUsuario,
    getProfile,
    putUsuario,
}