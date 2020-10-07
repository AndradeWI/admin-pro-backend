const path = require('path');
const fs = require('fs');

const { response } = require('express');

const { v4: uuidv4 } = require('uuid');
const { atualizarImagem } = require('../helpers/atualizar-imagem');


const fileUpload = ( req, res = response ) => {
    
    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = [ 'hospitais', 'medicos', 'usuarios' ];
    if ( !tiposValidos.includes(tipo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'Não é médico, usuário ou hospital'
        });
    }

    // Validar que existe um arquivo
    if ( !req.files || Object.keys(req.files).length === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'Não possui arquivos para upload'
        });
    }

    // Processar a imagem
    const file = req.files.img;

    const nomeCortado = file.name.split('.');
    const extensionArchivo = nomeCortado[ nomeCortado.length - 1 ];

    // Validar extension
    const extensionValidas = ['png','jpg','jpeg','gif'];
    if ( !extensionValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            ok: false,
            msg: 'Não é uma extensão permitida'
        });
    }

    // Gerar o nome do archivo
    const nomeArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar imagem
    const path = `./uploads/${ tipo }/${ nomeArchivo }`;

    // Mover a imagem
    file.mv( path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error ao mover imagem'
            });
        }

        // Atualizar Imagem
        atualizarImagem( tipo, id, nomeArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nomeArchivo
        });
    });

}

const retornaImagem = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    // Imagem default
    if ( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile( pathImg );
    }

}

module.exports = {
    fileUpload,
    retornaImagem
}