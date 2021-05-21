/*
    Event Routes
    /api/calls
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearCall, getCalls, getCallsCR, getCallsUser, getTypeReq, getDescReq } = require('../controllers/call');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


router.get('/', getCalls);

//Buscar Tipo de requerimiento
router.get('/req', getTypeReq );

//Buscar desc de requerimiento
router.get('/req/:request_id', getDescReq );

//Buscar por cedula o rif
router.get('/:ci_rif', getCallsCR );


//Buscar lo que hice hoy
router.get('/user/:id_user', getCallsUser )

// Crear un nuevo evento call
router.post(
    '/',
    [
        check('tipo_solicitud','El titulo es obligatorio').not().isEmpty(),
        check('tipo_llamada','Fecha de inicio es obligatoria').not().isEmpty(),
        check('descripcion','Fecha de finalización es obligatoria').not().isEmpty(),
        check('num_rif_ci','Rif/CI solo se permite numeros').not().isEmpty().isNumeric(),
        validarCampos
    ],
    crearCall
);



module.exports = router;