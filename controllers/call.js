const { response } = require('express');
const moment = require('moment');
const { Op, QueryTypes } = require('sequelize');
const { db } = require('../database/config');
const { generarJWT } = require('../helpers/jwt');
const { Call, Client, Request, TypeRequest } = require('../models/Call');


const getCalls = async( req, res = response ) => {

    const calls = await Call.findAll();
    const {uid, name} = req
     // console.log(uid, name)
     
    // Generar JWT
    const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        calls,
        token,
        msg: 'Perfect'
    });
}

//get calls por cedula o rif
const getCallsCR = async( req, res = response ) => {

    const { ci_rif } = req.params;
    console.log(ci_rif)
    const client = await Client.findOne({
        where:{
            ci_rif: ci_rif
        }
    });
    const {uid, name} = req
    //  console.log(uid, name)
    if ( !client ) {
        return res.status(400).json({
            ok: false,
            msg: 'El Cliente no existe'
        });
    }
     
    // Generar JWT
    const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        client,
        token,
        msg: 'Perfect'
    });
}

//get calls creada muestra por fecha
const getCallsUser = async( req, res = response ) => {
    const updatedAt = moment().format('YYYY-MM-D%');
    // const updatedAt = new Date()
    const { id_user } = req.params;
    console.log(id_user)
    // const calls = await Call.findAll({
    //     where:{
    //         id_user: id_user,

    //         updatedAt: {
    //             [Op.like]: updatedAt
    //         }  
    //     }
    // });

    let calls = await db.query(`SELECT form_calls.id, requests.request, type_requests.type_request, form_calls.description, users.name, status
    .status
    FROM form_calls 
    INNER JOIN requests ON form_calls.request_id = requests.id
    INNER JOIN type_requests ON form_calls.type_request_id = type_requests.id
    INNER JOIN users ON form_calls.user_id = users.id
    INNER JOIN status ON form_calls.status_id = status.id
    WHERE form_calls.updateAt LIKE $updatedAt and form_calls.user_id = $user_id
    ORDER BY form_calls.id DESC`, {
        type: QueryTypes.SELECT,
        bind: {
            user_id: id_user,
            updatedAt: updatedAt
        }});

    const {uid, name} = req
     // console.log(uid, name)
     
    // Generar JWT
    const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        calls,
        token,
        msg: 'Perfect User'
    });
}

//get Tipos de requetimiento como solicitud e Incidencia
const getTypeReq = async( req, res = response ) => {

    // const { ci_rif } = req.params;
    // console.log(ci_rif)
    const typesReq = await Request.findAll();

    const {uid, name} = req
     console.log(uid, name)
    if ( !typesReq ) {
        return res.status(400).json({
            ok: false,
            msg: 'Contacte con su Administrador'
        });
    }
     
    // Generar JWT
    const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        typesReq,
        token,
        msg: 'Perfect'
    });
}

//get Description de requetimiento como solicitud e Incidencia
const getDescReq = async( req, res = response ) => {

    const { request_id } = req.params;
    console.log(request_id)
    const descReq = await TypeRequest.findAll({
        where: {
            request_id: request_id
        }
    });

    const {uid, name} = req
     console.log(uid, name)
    if ( !descReq ) {
        return res.status(400).json({
            ok: false,
            msg: 'Contacte con su Administrador'
        });
    }
     
    // Generar JWT
    const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        descReq,
        token,
        msg: 'Perfect'
    });
}

const crearCall = async ( req, res = response ) => {

    const call = new Call( req.body );

    try {

        const eventoGuardado = await call.save();

        res.json({
            ok: true,
            call: eventoGuardado,
            msg: 'LLamada Guardada',
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    crearCall,
    getCalls,
    getCallsCR,
    getCallsUser,
    getTypeReq,
    getDescReq,
}