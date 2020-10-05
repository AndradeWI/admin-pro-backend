const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { gerarJWT } = require('../helpers/jwt');


const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioBD = await Usuario.findOne({ email });

        if ( !usuarioBD ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email inválido'
            });
        }

        // Verificar senha
        const validPassword = bcrypt.compareSync( password, usuarioBD.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: 'false',
                msg: 'Senha inválida'
            });
        }

        // Gerar o TOKEN - JWT
        const token = await gerarJWT( usuarioBD.id );

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Fale com o Administrador'
        })
    }

}

module.exports = {
    login
}