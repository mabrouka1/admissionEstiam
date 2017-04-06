var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
require('mongoose-moment')(mongoose);
var moment = require('moment');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({storage: storage}).single('file');


var Candidacy = require('../models/Dossier');

/* GET users Home. */
router.get('/', function (req, res, next) {
    res.render('users/index', {dashboard: 'active', title: 'Admission Estiam - Espace Admission'});
});


/* GET users Home. */
router.get('/candidacy', function (req, res, next) {
    Candidacy.findOne({_id: req.user._id}, function (err, existingCandidacy) {
        res.render('users/candidacy', {
            admission: 'active',
            candidacy: 'active',
            title: 'Admission Estiam - Candidature',
            existingCandidacy: existingCandidacy
        });
    });
});

/* Save candidacy. */
router.post('/candidacy/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.json({message: err});
            return;
        }
        res.json({message: req.file.path});
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
        res.json({message: data});
        return;
    }
    var data = parseInputs(req.body);
    var candidacy = {_id: req.user._id};
    switch (data.form) {
        case 'form_info':
            candidacy.candidate = {
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
            };
            break;
        case 'form_father':
            candidacy.father = {
                civilite: data.civilite,
                nom: data.nom,
                prenom: data.prenom,
                adresse: {
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal,
                },
                contact: {
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype,
                    emploi: data.emploi,
                    employeur: data.employeur
                }
            };
            break;
        case 'form_mother':
            candidacy.mother = {
                civilite: data.civilite,
                nom: data.nom,
                prenom: data.prenom,
                adresse: {
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal,
                },
                contact: {
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype,
                    emploi: data.emploi,
                    employeur: data.employeur
                }
            };
            break;
        case 'form_tutor':
            candidacy.tutor = {
                civilite: data.civilite,
                nom: data.nom,
                prenom: data.prenom,
                adresse: {
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal,
                },
                contact: {
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype,
                    emploi: data.emploi,
                    employeur: data.employeur
                }
            };
            break;
        case 'form_cursus':

            candidacy.cursus = {
                last: {
                    year: data.last.year,
                    precisez: data.last.precisez,
                    school: data.last.school,
                    adresse: {
                        address: data.last.address,
                        compl_adresse: data.last.compl_adresse,
                        pays: data.last.pays,
                        ville: data.last.ville,
                        code_postal: data.last.code_postal
                    },
                    class: data.last.class,
                    speciality: data.last.speciality,
                    level: data.last.level,
                    other: data.last.other
                },

                previous: {
                    year: data.previous.year,
                    precisez: data.previous.precisez,
                    school: data.previous.school,
                    adresse: {
                        address: data.previous.address,
                        compl_adresse: data.previous.compl_adresse,
                        pays: data.previous.pays,
                        ville: data.previous.ville,
                        code_postal: data.previous.code_postal
                    },
                    class: data.previous.class,
                    speciality: data.previous.speciality,
                    level: data.previous.level,
                    other: data.previous.other
                },

            };

            break;
        case 'form_files':
            candidacy.files = {
                identity: {
                    document: data.cni_type || '',
                    number: data.cni_number || '',
                    date: moment(data.cni_date, "DD-MM-YYYY") || null,
                    file: data.file_cni || '',
                },
                sejour: {
                    number: data.sjr_number,
                    date: moment(data.sjr_date, "DD-MM-YYYY") || null,
                    file: data.file_sjr || '',
                },
                academy: {
                    last_report: data.file_blt_last || '',
                    prev_report: data.file_blt_prev || '',
                    high_diploma: data.file_dlp || '',

                }
            };

            break;
        case 'form_wish':
            candidacy.wish = {
                year: data.year,
                cursus: data.cursus,
                precisez: data.precisez,
                campus: data.campus,
                message: data.message,
            };
            break;
        default:
            console.log(data);
            res.json({message: 'Invalid Form Type'});
            return;
            break;

    }
    saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
        res.json({message: result});
    }).catch(function (err) {
        res.json({message: err});
    });

});

function saveOrUpdateCandidateForm(id, candidacy) {
    return Candidacy.update({_id: id}, candidacy, {
        upsert: true,
        setDefaultsOnInsert: true
    })
}

function parseInputs(data) {
    var ret = {};
    retloop:
        for (var input in data) {
            var val = data[input];

            var parts = input.split('[');
            var last = ret;

            for (var i in parts) {
                var part = parts[i];
                if (part.substr(-1) == ']') {
                    part = part.substr(0, part.length - 1);
                }

                if (i == parts.length - 1) {
                    last[part] = val;
                    continue retloop;
                } else if (!last.hasOwnProperty(part)) {
                    last[part] = {};
                }
                last = last[part];
            }
        }
    return ret;
}


module.exports = router;
