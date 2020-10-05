/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.post( '/',
    [
        check('email', 'O email é obrigatório').isEmail(),
        check('password', 'A senha é obrigatório').not().isEmpty(),
        validarCampos
    ],
    login
)



module.exports = router;