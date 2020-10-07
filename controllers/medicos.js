const { response } = require('express');

const Medico = require('../models/medico');


const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                          .populate('usuario', 'name')
                          .populate('hospital', 'name img');

    res.json({
        ok: true,
        medicos
    });
}

const createMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({ 
        usuario: uid,
        ...req.body 
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
        
    }
}

const updateMedico = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'updateMedicos'
    });
}

const deleteMedico = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'deleteMedicos'
    });
}

module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
}