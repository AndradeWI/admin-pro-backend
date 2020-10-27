const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { gerarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try {

       const { name, email, picture } = await googleVerify( googleToken );

       const usuarioDB = await Usuario.findOne({ email });
       let usuario;

       if ( !usuarioDB ) {
           // Se não existe usuário
           usuario = new Usuario({
                name,
                email,
                password: '@@@',
                img: picture,
                google: true
           });
       } else {
           // Existe usuário
           usuario = usuarioDB;
           usuario.google = true;
       }

       // Salvar Usuário
       await usuario.save();

       // Gerar o TOKEN - JWT
       const token = await gerarJWT( usuario.id );
        
        res.json({
            ok: true,
            token
        });

    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: 'Token não é válido',
        });
        
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Gerar o TOKEN - JWT
    const token = await gerarJWT( uid );

    // Obter o usuário pelo UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}