var express = require('express');
var router = express.Router();
var moment = require('moment');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({storage: storage}).single('file');


var Candidacy = require('../models/Dossier');
var Candidate = require('../models/Candidate');
var Adresse = require('../models/Adresse');
var Contact = require('../models/Contact');
var Father = require('../models/Father');
var ContactParent = require('../models/ContactParents');
var Mother = require('../models/Mother');
var Tutor = require('../models/Tutor');
var CursusYear = require('../models/CursusYear');
var Cursus = require('../models/Cursus');
var Files = require('../models/Files');
var Identity = require('../models/Identity');
var Sejour = require('../models/Sejour');
var Academy = require('../models/Academy');
var Wish = require('../models/Wish');

/* GET users Home. */
router.get('/', function (req, res, next) {
    res.render('users/index', {dashboard: 'active', title: 'Admission Estiam - Espace Admission'});
});


/* GET users Home. */
router.get('/candidacy', function (req, res, next) {
    Candidacy.model.findOne({_id: req.user._id}, function (err, result) {
        if (result) {
            result.deepPopulate([
                    'candidate.adresse',
                    'candidate.contact',
                    'father.adresse',
                    'father.contact',
                    'mother.adresse',
                    'mother.contact',
                    'tutor.adresse',
                    'tutor.contact',
                    'cursus.last.adresse',
                    'cursus.previous.adresse',
                    'files.identity',
                    'files.sejour',
                    'files.academy',
                    'wish',
                ],
                function (err, candidacy) {
                    console.log(candidacy);
                    res.render('users/candidacy', {
                        admission: 'active',
                        candidacy: 'active',
                        title: 'Admission Estiam - Candidature',
                        existingCandidacy: candidacy
                    });

                });
        }
        else {
            res.render('users/candidacy', {
                admission: 'active',
                candidacy: 'active',
                title: 'Admission Estiam - Candidature',
                existingCandidacy: {}
            });
        }
    });
});

/* Save candidacy. */
router.post('/candidacy/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.json({message: err});
            return;
        }
        res.json({message: req.file});
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

    switch (data.form) {
        case 'form_info':
            Candidacy.model.findById(req.user._id).populate('candidate').exec(function (err, candidacy) {
                candidacy = candidacy || {};
                var address = new Adresse.model({
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal
                });
                if (typeof candidacy.candidate !== 'undefined' && candidacy.candidate.adresse !== null) {
                    Adresse.model.remove({_id: candidacy.candidate.adresse}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                address.save();
                var contact = new Contact.model({
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype
                });
                if (typeof candidacy.candidate !== 'undefined' && candidacy.candidate.contact !== null) {
                    Contact.model.remove({_id: candidacy.candidate.contact}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                contact.save();
                var candidate = new Candidate.model({
                    civilite: data.civilite,
                    nom: data.nom,
                    prenom: data.prenom,
                    nom_d_naiss: data.nom_d_naiss,
                    dept_d_naiss: data.dept_d_naiss,
                    ville_d_naiss: data.ville_d_naiss,
                    pays_d_naiss: data.pays_d_naiss,
                    nationalite: data.nationalite,
                    date_d_naiss: moment(data.date_d_naiss, "DD-MM-YYYY"),
                    adresse: address,
                    contact: contact
                });
                if (typeof candidacy.candidate !== 'undefined') {
                    Candidate.model.remove({_id: candidacy.candidate._id}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                candidate.save();
                candidacy = new Candidacy.model({candidate: candidate});

                saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                    res.json({message: result});
                }).catch(function (err) {
                    res.json({message: err});
                });

            });
            break;
        case 'form_father':
            Candidacy.model.findById(req.user._id).populate('father').exec(function (err, candidacy) {
                candidacy = candidacy || {};
                var address = new Adresse.model({
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal,
                });
                if (typeof candidacy.father !== 'undefined' && candidacy.father.adresse !== null) {
                    Adresse.model.remove({_id: candidacy.father.adresse}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                address.save();
                var contact = new ContactParent.model({
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype,
                    emploi: data.emploi,
                    employeur: data.employeur
                });
                if (typeof candidacy.father !== 'undefined' && candidacy.father.contact !== null) {
                    ContactParent.model.remove({_id: candidacy.father.contact}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                contact.save();
                var father = new Father.model({
                    civilite: data.civilite,
                    nom: data.nom,
                    prenom: data.prenom,
                    adresse: address,
                    contact: contact
                });
                if (typeof candidacy.father !== 'undefined') {
                    Father.model.remove({_id: candidacy.father._id}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                father.save();

                candidacy = new Candidacy.model({father: father});

                saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                    res.json({message: result});
                }).catch(function (err) {
                    res.json({message: err});
                });
            });
            break;
        case 'form_mother':
            Candidacy.model.findById(req.user._id).populate('mother').exec(function (err, candidacy) {
                candidacy = candidacy || {};
                var address = new Adresse.model({
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal,
                });
                if (typeof candidacy.mother !== 'undefined' && candidacy.mother.adresse !== null) {
                    Adresse.model.remove({_id: candidacy.mother.adresse}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                address.save();
                var contact = new ContactParent.model({
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype,
                    emploi: data.emploi,
                    employeur: data.employeur
                });
                if (typeof candidacy.mother !== 'undefined' && candidacy.mother.contact !== null) {
                    ContactParent.model.remove({_id: candidacy.mother.contact}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                contact.save();
                var mother = new Mother.model({
                    civilite: data.civilite,
                    nom: data.nom,
                    prenom: data.prenom,
                    adresse: address,
                    contact: contact
                });
                if (typeof candidacy.father !== 'undefined') {
                    Mother.model.remove({_id: candidacy.father._id}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                mother.save();

                candidacy = new Candidacy.model({mother: mother});

                saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                    res.json({message: result});
                }).catch(function (err) {
                    res.json({message: err});
                });
            });
            break;
        case 'form_tutor':
            Candidacy.model.findById(req.user._id).populate('tutor').exec(function (err, candidacy) {
                candidacy = candidacy || {};
                var address = new Adresse.model({
                    address: data.address,
                    compl_adresse: data.compl_adresse,
                    pays: data.pays,
                    ville: data.ville,
                    code_postal: data.code_postal,
                });
                if (typeof candidacy.tutor !== 'undefined' && candidacy.tutor.adresse !== null) {
                    Adresse.model.remove({_id: candidacy.tutor.adresse}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                address.save();
                var contact = new ContactParent.model({
                    telfixe: data.telfixe,
                    telmob: data.telmob,
                    email: data.email,
                    skype: data.skype,
                    emploi: data.emploi,
                    employeur: data.employeur
                });
                if (typeof candidacy.tutor !== 'undefined' && candidacy.tutor.contact !== null) {
                    ContactParent.model.remove({_id: candidacy.tutor.contact}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                contact.save();
                var tutor = new Tutor.model({
                    civilite: data.civilite,
                    nom: data.nom,
                    prenom: data.prenom,
                    adresse: address,
                    contact: contact
                });
                if (typeof candidacy.tutor !== 'undefined') {
                    Tutor.model.remove({_id: candidacy.tutor._id}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                tutor.save();

                candidacy = new Candidacy.model({tutor: tutor});

                saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                    res.json({message: result});
                }).catch(function (err) {
                    res.json({message: err});
                });
            });
            break;
        case 'form_cursus':
            Candidacy.model.findById(req.user._id)
                .populate({
                    path: 'cursus', model: 'Cursus',
                    populate: {
                        path: 'last', model: 'CursusYear',
                    },
                })
                .populate({
                    path: 'cursus', model: 'Cursus',
                    populate: {
                        path: 'previous', model: 'CursusYear',
                    },
                })
                .exec(function (err, candidacy) {
                    candidacy = candidacy || {};
                    var last_address = new Adresse.model({
                        address: data.last.address,
                        compl_adresse: data.last.compl_adresse,
                        pays: data.last.pays,
                        ville: data.last.ville,
                        code_postal: data.last.code_postal
                    });
                    if (typeof candidacy.cursus !== 'undefined' && candidacy.cursus.last !== null && candidacy.cursus.last.adresse !== null) {
                        Adresse.model.remove({_id: candidacy.cursus.last.adresse}, function (err) {
                            if (err) {
                                res.json({message: err});
                                return;
                            }
                        });
                    }
                    last_address.save();

                    var previous_address = new Adresse.model({
                        address: data.previous.address,
                        compl_adresse: data.previous.compl_adresse,
                        pays: data.previous.pays,
                        ville: data.previous.ville,
                        code_postal: data.previous.code_postal
                    });
                    if (typeof candidacy.cursus !== 'undefined' && candidacy.cursus.previous !== null && candidacy.cursus.previous.adresse !== null) {
                        Adresse.model.remove({_id: candidacy.cursus.previous.adresse}, function (err) {
                            if (err) {
                                res.json({message: err});
                                return;
                            }
                        });
                    }
                    previous_address.save();

                    var cursus_year_last = new CursusYear.model({
                        year: data.last.year,
                        precisez: data.last.precisez,
                        school: data.last.school,
                        adresse: last_address,
                        class: data.last.class,
                        speciality: data.last.speciality,
                        level: data.last.level,
                        other: data.last.other
                    });
                    if (typeof candidacy.cursus !== 'undefined' && candidacy.cursus.last !== null) {
                        CursusYear.model.remove({_id: candidacy.cursus.last._id}, function (err) {
                            if (err) {
                                res.json({message: err});
                                return;
                            }
                        });
                    }
                    cursus_year_last.save();

                    var cursus_year_previous = new CursusYear.model({
                        year: data.previous.year,
                        precisez: data.previous.precisez,
                        school: data.previous.school,
                        adresse: previous_address,
                        class: data.previous.class,
                        speciality: data.previous.speciality,
                        level: data.previous.level,
                        other: data.previous.other
                    });
                    if (typeof candidacy.cursus !== 'undefined' && candidacy.cursus.previous !== null) {
                        CursusYear.model.remove({_id: candidacy.cursus.previous._id}, function (err) {
                            if (err) {
                                res.json({message: err});
                                return;
                            }
                        });
                    }
                    cursus_year_previous.save();

                    var cursus = new Cursus.model({
                        last: cursus_year_last,
                        previous: cursus_year_previous
                    });
                    if (typeof candidacy.cursus !== 'undefined') {
                        Tutor.model.remove({_id: candidacy.cursus._id}, function (err) {
                            if (err) {
                                res.json({message: err});
                                return;
                            }
                        });
                    }
                    cursus.save();

                    candidacy = new Candidacy.model({cursus: cursus});

                    saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                        res.json({message: result});
                    }).catch(function (err) {
                        res.json({message: err});
                    });
                });
            break;
        case 'form_files':
            Candidacy.model.findById(req.user._id).populate('files').exec(function (err, candidacy) {
                var identity = new Identity.model({
                    document: data.cni_type || '',
                    number: data.cni_number || '',
                    date: moment(data.cni_date, "DD-MM-YYYY") || null,
                    file: JSON.parse(data.file_cni) || '',
                });
                if (typeof candidacy.files !== 'undefined' && candidacy.files.identity !== null) {
                    Identity.model.remove({_id: candidacy.files.identity}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                identity.save();
                var sejour = new Sejour.model({
                    number: data.sjr_number,
                    date: moment(data.sjr_date, "DD-MM-YYYY") || null,
                    file: JSON.parse(data.file_sjr || '{}'),
                    url: `<a href="/uploads/${JSON.parse(data.file_sjr || '{}').filename || ''}">${JSON.parse(data.file_sjr || '{}').filename || ''} </a>`
                });
                if (typeof candidacy.files !== 'undefined' && candidacy.files.sejour !== null) {
                    Sejour.model.remove({_id: candidacy.files.sejour}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                sejour.save();

                var academy = new Academy.model({
                    last_report: JSON.parse(data.file_blt_last || '{}'),
                    prev_report: JSON.parse(data.file_blt_prev || '{}'),
                    high_diploma: JSON.parse(data.file_dlp || '{}'),

                });
                if (typeof candidacy.files !== 'undefined' && candidacy.files.academy !== null) {
                    Academy.model.remove({_id: candidacy.files.academy}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                academy.save();

                var files = new Files.model({
                    identity: identity,
                    sejour: sejour,
                    academy: academy,
                });
                if (typeof candidacy.files !== 'undefined') {
                    Files.model.remove({_id: candidacy.files._id}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                files.save();

                candidacy = new Candidacy.model({files: files});

                saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                    res.json({message: result});
                }).catch(function (err) {
                    res.json({message: err});
                });
            });
            break;
        case 'form_wish':
            Candidacy.model.findById(req.user._id).populate('wish').exec(function (err, candidacy) {
                var wish = new Wish.model({
                    year: data.year,
                    cursus: data.cursus,
                    precisez: data.precisez,
                    campus: data.campus,
                    message: data.message,
                });
                if (typeof candidacy.wish !== 'undefined') {
                    Wish.model.remove({_id: candidacy.wish._id}, function (err) {
                        if (err) {
                            res.json({message: err});
                            return;
                        }
                    });
                }
                wish.save();

                candidacy = new Candidacy.model({wish: wish});

                saveOrUpdateCandidateForm(req.user._id, candidacy).then(function await(result) {
                    res.json({message: result});
                }).catch(function (err) {
                    res.json({message: err});
                });
            });
            break;
        default:
            res.json({message: 'Invalid Form Type'});
            return;
            break;

    }


});

/* GET Message */

router.get('/messages', function (req, res, next) {
    res.render('users/messages', {dashboard: 'active', title: 'Messages Estiam - Espace Admission'});
});


function saveOrUpdateCandidateForm(id, candidacy) {
    return Candidacy.model.update({_id: id}, candidacy, {
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
