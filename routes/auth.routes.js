/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post( '/',
    [
        check('email', 'O email é obrigatório').isEmail(),
        check('password', 'A senha é obrigatório').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post( '/google',
    [
        check('token', 'O token do Google é obrigatório').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
);

router.get( '/renew',
    validarJWT,
    renewToken
);



module.exports = router;