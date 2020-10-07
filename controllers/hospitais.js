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

const updateHospital = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'updateHospitais'
    });
}

const deleteHospital = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'deleteHospitais'
    });
}

module.exports = {
    getHospitais,
    createHospital,
    updateHospital,
    deleteHospital
}