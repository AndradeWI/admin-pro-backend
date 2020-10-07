const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const deletarImagem = ( path ) => {
    if ( fs.existsSync( path ) ) {
        // Apagar imagem anterior
        fs.unlinkSync( path );
    }
}

const atualizarImagem = async( tipo, id, nomeArchivo ) => {

    let hasPath = '';

    switch (tipo) {
        case 'medicos':
                const medico = await Medico.findById(id);
                if ( !medico ) {
                    console.log('Não é um id de médico');
                    return false;
                }

                hasPath = `./uploads/medicos/${ medico.img }`;
                deletarImagem( hasPath );

                medico.img = nomeArchivo;
                await medico.save();
                return true;

            break;
        
        case 'hospitais':
            const hospital = await Hospital.findById(id);
                if ( !hospital ) {
                    console.log('Não é um id de hospital');
                    return false;
                }

                hasPath = `./uploads/hospitais/${ hospital.img }`;
                deletarImagem( hasPath );

                hospital.img = nomeArchivo;
                await hospital.save();
                return true;
        
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if ( !usuario ) {
                console.log('Não é um id de usuário');
                return false;
            }

            hasPath = `./uploads/hospitais/${ usuario.img }`;
            deletarImagem( hasPath );

            usuario.img = nomeArchivo;
            await usuario.save();
            return true;
    
            break;
    }


}

module.exports = {
    atualizarImagem,
}