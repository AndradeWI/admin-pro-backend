/* 
    Medicos
    Rota: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
} = require('../controllers/medicos');

const router = Router();

router.get( '/', getMedicos);

router.post( '/',
    [
        validarJWT,
        check('name', 'O nome do médico é obrigatório').not().isEmpty(),
        check('hospital', 'O id do hospital não é válido').isMongoId(),
        validarCampos
    ], 
    createMedico
);

router.put( '/:id',
    [],
    updateMedico
);

router.delete( '/:id',
    deleteMedico
);

module.exports = router;