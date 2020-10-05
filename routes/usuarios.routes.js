/*
    Rota: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getUsuarios, crearUsuarios, updateUser, excluirUsuario } = require('../controllers/usuarios');

const router = Router();

router.get( '/', validarJWT, getUsuarios);

router.post( '/',
    [
        check('name', 'O nome é obrigatório').not().isEmpty(),
        check('password', 'A senha é obrigatório').not().isEmpty(),
        check('email', 'O email é obrigatório').isEmail(),
        validarCampos
    ], 
    crearUsuarios
);

router.put( '/:id',
    [
        validarJWT,
        check('name', 'O nome é obrigatório').not().isEmpty(),
        check('email', 'A email é obrigatório').isEmail(),
        check('role', 'O role é obrigatório').not().isEmpty(),
        validarCampos
    ],
    updateUser
);

router.delete( '/:id',
    validarJWT,
    excluirUsuario
);

module.exports = router;