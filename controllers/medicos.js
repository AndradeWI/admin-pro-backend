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

const updateMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById( id );

        if ( !medico ) {
            return res.status(404).json({
                ok: true,
                msg: 'Médico não encontrado'
            });
        }

        const dadosMedico = {
            ... req.body,
            usuario: uid
        }

        const medicoAtualizado = await Medico.findByIdAndUpdate( id, dadosMedico, { new: true } );
        
        res.json({
            ok: true,
            msg: 'updateMedico',
            medico: medicoAtualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
        
    }
}

const deleteMedico = async (req, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById( id );

        if ( !medico ) {
            return res.status(404).json({
                ok: true,
                msg: 'Médico não encontrado'
            });
        }

        await Medico.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Médico excluído'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
        
    }
}

module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
}