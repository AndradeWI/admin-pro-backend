const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async(req, res = response ) => {

    const busca = req.params.busca;
    const regex = new RegExp( busca, 'i' );

    const [ usuarios, medicos, hospitais ] = await Promise.all([
        Usuario.find({ name: regex }),
        Medico.find({ name: regex }),
        Hospital.find({ name: regex }),
    ]);


    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitais
    });
}

const getColeccion = async(req, res = response ) => {

    const tabla = req.params.tabla;
    const busca = req.params.busca;
    const regex = new RegExp( busca, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ name: regex })
                               .populate('usuario', 'name img')
                               .populate('hospital', 'name img');
            break;

        case 'hospitais':
            data = await Hospital.find({ name: regex })
                                 .populate('usuario', 'name img');
            break;

        case 'usuarios':
            data = await Usuario.find({ name: regex });
            break;
    
        default:
          return  res.status(400).json({
                ok: false,
                msg: 'A tabla precisa ser usuarios/busca ou  medicos/busca ou hospitais/busca'
            });

    }

    res.status(200).json({
        ok: true,
        resultados: data
    });
}


module.exports = {
    getTodo,
    getColeccion
}