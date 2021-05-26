/*
    Event Routes
    /api/puntoConsulta
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getTerm, getPlan } = require('../controllers/puntoConsulta');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
// router.use( validarJWT );


router.get('/:comerRif', getTerm);
router.get('/plan/:aboTerminal', getPlan);





module.exports = router;