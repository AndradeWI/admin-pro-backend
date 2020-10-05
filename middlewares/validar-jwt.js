const jwt = require('jsonwebtoken');
const { response } = require("express");


const validarJWT = (req, res = response, next) => {

    // Ler o token
    const token = req.header('x-token');
    console.log(token);

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'Não possui token na requisição'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }

}


module.exports = {
    validarJWT
}