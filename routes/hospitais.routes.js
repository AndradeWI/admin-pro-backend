/* 
    Hospitais
    Rota: '/api/hospitais'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getHospitais,
    createHospital,
    updateHospital,
    deleteHospital
} = require('../controllers/hospitais');

const router = Router();

router.get( '/', getHospitais);

router.post( '/',
    [
        validarJWT,
        check('name', 'O nome do hospital é obrigatório').not().isEmpty(),
        validarCampos
    ], 
    createHospital
);

router.put( '/:id',
    [
        validarJWT,
        check('name', 'O nome do hospital é obrigatório').not().isEmpty(),
        validarCampos
    ],
    updateHospital
);

router.delete( '/:id',
    validarJWT,
    deleteHospital
);

module.exports = router;