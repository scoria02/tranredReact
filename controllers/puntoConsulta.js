const { response } = require('express');
const moment = require('moment');
const { QueryTypes } = require('sequelize');
const { db } = require('../database/config');


const getTerm = async( req, res = response ) => {

    try {
        
        const { comerRif } = req.params;
        console.log(comerRif)
        let term = await db.query(`SELECT DISTINCT e.aboTerminal
		
        FROM [MilPagos].[dbo].[Comercios]
        INNER JOIN Abonos AS e ON comerCod = e.aboCodComercio 
        where comerRif = $comerRif and comerEstatus = '5'
        `, {
            type: QueryTypes.SELECT,
            bind: {
                comerRif: comerRif
            }});

            res.json({
                ok: true,
                term,
                msg: 'Perfect'
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}



//get PlanCuotas 
const getPlan = async( req, res = response ) => {
    
    try {
        
        const fechaPago = moment().format('YYYY-MM-D');
        const fechaProceso = moment().format('YYYY-MM-D');
        const { aboTerminal } = req.params;
        console.log( aboTerminal )
        let plan = await db.query(`SELECT 
        idPlanCuota,
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
    
        res.json({
            ok: true,
            plan,
            msg: 'Perfect Tamos Bien Loco'
        });

    } catch (error) {
        
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