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
                msg: 'Perfect',
                // excel
                
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


//get Movimiento Por fecha
const getMovimiento = async( req, res = response ) => {
    
    try {
        
        const { aboTerminal, fechaIni, fechaFin } = req.params;
        console.log( aboTerminal, fechaIni, fechaFin );
        let historico = await db.query(`SELECT  hisId as id
            ,([hisAmountTDD]+[hisAmountTDC]+[hisAmountComisionBanco]) as Monto
            ,hisComisionBancaria as ComisionBancario
            ,hisComisionMantenimiento as ComisionMantenimiento
            ,hisIvaSobreMantenimiento as IvaMantenimiento
            ,hisAmountTotal as MontoAbonado
            ,hisFechaEjecucion as Fecha
            ,hisDebitoContraCargo
                FROM Historico
            where aboTerminal = $aboTerminal and  hisFechaEjecucion between $fechaIni and $fechaFin `, {
            type: QueryTypes.SELECT,
            bind: {
                aboTerminal: aboTerminal,
                fechaIni: fechaIni,
                fechaFin: fechaFin
            }});
    
        res.json({
            ok: true,
            historico,
            msg: 'Perfect Rata Blanca'
        });

    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
    

}


//Para Descargar Excel
const getExcel = async( req, res = response ) => {

    try {
        const nombreMes = {
            '01': 'ENERO',
            '02': 'FEBRERO',
            '03': 'MARZO',
            '04': 'ABRIL',
            '05': 'MAYO',
            '06': 'JUNIO',
            '07': 'JULIO',
            '08': 'AGOSTO',
            '09': 'SEPTIEMBRE',
            '10': 'OCTUBRE',
            '11': 'NOVIEMBRE',
            '12': 'DICIEMBRE',

        }
       
        const { comerRif, month, year, aboTerminal } = req.params;
        const mes = nombreMes[month];
        console.log(comerRif, mes)
		// res.download('C:\\Archivos\\nodeArchivos\\V15161929.xls')
        const file = `/mnt/reportes/${year}/${mes}/${aboTerminal}/${comerRif}_${aboTerminal}_${month}${year}.xls`;
        console.log(file)
        res.download(file);  
    

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}


//Para Descargar Excel
const getPdf = async( req, res = response ) => {

    try {
        const nombreMes = {
            '01': 'ENERO',
            '02': 'FEBRERO',
            '03': 'MARZO',
            '04': 'ABRIL',
            '05': 'MAYO',
            '06': 'JUNIO',
            '07': 'JULIO',
            '08': 'AGOSTO',
            '09': 'SEPTIEMBRE',
            '10': 'OCTUBRE',
            '11': 'NOVIEMBRE',
            '12': 'DICIEMBRE',

        }
       
        const { comerRif, month, year, aboTerminal } = req.params;
        const mes = nombreMes[month];
        console.log(comerRif, mes)
		// res.download('C:\\Archivos\\nodeArchivos\\V15161929.xls')
        
        const file = `/mnt/reportes/${year}/${mes}/${aboTerminal}/${comerRif}_${aboTerminal}_${month}${year}.pdf`;
        // const file = `/mnt/reportes/2021/abril/01001246/J309863681_01001246_042021.pdf`;
        console.log(file)
        res.download(file);  
    

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
    getMovimiento,
    getExcel,
    getPdf,
}