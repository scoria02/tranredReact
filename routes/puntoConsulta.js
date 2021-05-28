/*
    Event Routes
    /api/puntoConsulta
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getTerm, getPlan, getMovimiento, getExcel, getPdf } = require('../controllers/puntoConsulta');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
// router.use( validarJWT );


router.get('/:comerRif', getTerm);
router.get('/plan/:aboTerminal', getPlan);
router.get('/movimientos/:aboTerminal/:fechaIni/:fechaFin', getMovimiento );

//prueba de descarga de archivo excel
router.get('/excel/:year/:month/:aboTerminal/:comerRif', getExcel);
router.get('/pdf/:year/:month/:aboTerminal/:comerRif', getPdf);


// router.get('/download/excel/:comerRif/:mes', function(req, res){
//     const file = `C:\\Archivos\\nodeArchivos\\V15161929.xlsx`;
//     res.download(file); // Set disposition and send it.
//   });






module.exports = router;