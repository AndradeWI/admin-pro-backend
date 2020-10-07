/* 
    Rota: api/todo/:busca
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getTodo, getColeccion } = require('../controllers/buscas');

const router = Router();

router.get('/:busca', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busca', validarJWT, getColeccion);

module.exports = router;