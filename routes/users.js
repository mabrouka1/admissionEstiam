var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
require('mongoose-moment')(mongoose);
var moment = require('moment');


var Candidacy = require('../models/Dossier');

/* GET users Home. */
router.get('/', function (req, res, next) {
    res.render('users/index', {dashboard: 'active', title: 'Admission Estiam - Espace Admission'});
});


/* GET users Home. */
router.get('/candidacy', function (req, res, next) {
    Candidacy.findOne({_id: req.user._id}, function (err, existingCandidacy) {
        console.log(existingCandidacy.candidate.civilite);
        res.render('users/candidacy', {
            admission: 'active',
            candidacy: 'active',
            title: 'Admission Estiam - Candidature',
            existingCandidacy: existingCandidacy
        });
    });
});

/* Save candidacy. */
router.post('/candidacy', function (req, res, next) {
    req.assert('form', 'Invalid Form Type').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        data = [];
        for (err in errors) {
            if (errors.hasOwnProperty(err)) {
                data.push(errors[err].msg);
            }
        }
        res.render('json/index', {
            data: data
        });

        return;
    }
    var data = req.body;
    var candidacy = null;

    switch (data.form) {
        case 'form_info':
            candidacy = {
                _id: req.user._id,
                candidate: {
                    civilite: data.civilite,
                    nom: data.nom,
                    prenom: data.prenom,
                    nom_d_naiss: data.nom_d_naiss,
                    dept_d_naiss: data.dept_d_naiss,
                    ville_d_naiss: data.ville_d_naiss,
                    pays_d_naiss: data.pays_d_naiss,
                    nationalite: data.nationalite,
                    date_d_naiss: moment(data.date_d_naiss, "DD-MM-YYYY"),
                    adresse: {
                        address: data.address,
                        compl_adresse: data.compl_adresse,
                        pays: data.pays,
                        ville: data.ville,
                        code_postal: data.code_postal
                    },
                    contact: {
                        telfixe: data.telfixe,
                        telmob: data.telmob,
                        email: data.email,
                        skype: data.skype
                    }
                }

            };
            break;
        case 'form_father':
            try {

                candidacy = new Candidacy({

                    _id: req.user._id,
                    father: {
                        civilite: data.civilite,
                        nom: data.nom,
                        prenom: data.prenom,
                        adresse: data.adresse,
                        compl_adresse: data.compl_adresse,
                        pays: data.pays,
                        ville: data.ville,
                        code_postal: data.code_postal,

                        contact: {
                            telfixe: data.telfixe,
                            telmob: data.telmob,
                            email: data.email,
                            skype: data.skype,
                            emploi: data.emploi,
                            employeur: data.employeur
                        },
                    },
                });


            } catch (err) {
                res.render('json/index', {
                    message: err
                });
            }
        default:
            res.json({message: 'Invalid Form Type'});
            return;
            break;

    }
    saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
        res.json({message: result});
    }).catch(function (err) {
        res.json({message: err});
    })

});

function saveOrUpdateCandidateForm(id, candidacy) {
    return Candidacy.update({_id: id}, candidacy, {
        upsert: true,
        setDefaultsOnInsert: true
    })
}


module.exports = router;
