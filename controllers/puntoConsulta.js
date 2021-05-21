const { response } = require('express');
const moment = require('moment');
const { Op, QueryTypes } = require('sequelize');
const { db, dbConnection } = require('../database/config');
const { generarJWT } = require('../helpers/jwt');
const { Call, Client, Request, TypeRequest } = require('../models/Call');


const getTerm = async( req, res = response ) => {

    const { aboCodComercio } = req.params;
    
    let term = await db.query(`SELECT aboTerminal
    FROM Abonos
        WHERE aboCodComercio = $aboCodComercio
    `, {
        type: QueryTypes.SELECT,
        bind: {
            aboCodComercio: aboCodComercio
        }});
    // const {uid, name} = req
     // console.log(uid, name)
     
    // Generar JWT
    // const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        term,
        msg: 'Perfect'
    });
}



//get PlanCuotas 
const getPlan = async( req, res = response ) => {
    const fechaPago = moment().format('YYYY-MM-D');
    const fechaProceso = moment().format('YYYY-MM-D');
    // console.log(fechaPago)
    // const updatedAt = new Date()
    const { aboTerminal } = req.params;
    
    let plan = await db.query(`SELECT 
     aboTerminal
     ,cast(ROUND(montoTotal,2) as numeric(17,2)) as MontoTotal -- devuelve entero con dos decimales 
     ,cast(ROUND(montoComision,2) as numeric(17,2)) as MontoPagado -- devuelve entero con dos decimales
     ,case when montoIVA < 0
           then
               null
       when montoIVA > 0
           then
            cast(ROUND(montoIVA,2) as numeric(17,2)) end  as IVA_Pagado -- devuelve entero con dos decimales 
     ,cast(ROUND(tasaValor,2) as numeric(17,2)) as Tasa_BCV -- devuelve entero con dos decimales 
     ,CONVERT(DATE,fechaProceso) as FechaProc
     ,CONVERT(DATE,fechaPago) as FechaPag
     ,e.descripcion
     FROM [MilPagos].[dbo].[PlanCuota]
        INNER JOIN Estatus AS e ON estatusId = e.id 
            where  aboTerminal = $aboTerminal and
                (fechaPago < $fechaPago or  fechaProceso < $fechaProceso)
        Order by fechaProceso asc`, {
        type: QueryTypes.SELECT,
        bind: {
            aboTerminal: aboTerminal,
            fechaPago: fechaPago,
            fechaProceso: fechaProceso
        }});

    //const {uid, name} = req
     // console.log(uid, name)
     
    // Generar JWT
    //const token = await generarJWT( uid, name );
    res.json({
        ok: true,
        plan,
        msg: 'Perfect Tamos Bien Loco'
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
    getTerm,
    getPlan,
    
}