const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitais = async(req, res = response) => {

    const hospitais = await Hospital.find()
                            .populate('usuario', 'name');

    res.json({
        ok: true,
        hospitais
    });
}

const createHospital = async(req, res = response) => {
    
    const uid = req.uid;
    const hospital = new Hospital({ 
        usuario: uid,
        ...req.body 
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
        
    }

}

const updateHospital = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById( id );

        if ( !hospital ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital não encontrado'
            });
        }

        const dadosHospital = {
            ... req.body,
            usuario: uid
        }

        const hospitalAtualizado = await Hospital.findByIdAndUpdate( id, dadosHospital, { new: true } );
        
        res.json({
            ok: true,
            msg: 'updateHospitais',
            hospital: hospitalAtualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
        
    }

}

const deleteHospital = async (req, res = response) => {

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById( id );

        if ( !hospital ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital não encontrado'
            });
        }

        await Hospital.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Hospital excluído'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
        
    }
}

module.exports = {
    getHospitais,
    createHospital,
    updateHospital,
    deleteHospital
}