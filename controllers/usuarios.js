const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { gerarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'name email role google img')
            .skip( desde )
            .limit( 5 ),
        
        Usuario.count()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuarios = async(req, res = response) => {

    const { email, password, name } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'O email já está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar senha
        const salt =bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // Gravar usuário
        await usuario.save();

        // Gerar o TOKEN - JWT
        const token = await gerarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Erro inesperado... revisar logs'
        });
    }

}

const updateUser = async(req, res = response) => {

    // TODO: Validar token e comprovar se é o usuário correto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Não existe um usuário com esse id'
            });
        }

        // Atualizações
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Já existe um usuário cadastrado com este email'
                });
            }
        }

        if ( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuários de google não podem mudar seu email'
            });
        }
        
        const usuarioAtualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioAtualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const excluirUsuario = async( req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Não existe um usuário com esse id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuário excluído!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    updateUser,
    excluirUsuario,
}