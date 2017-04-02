var mongoose = require('mongoose');

var dossierSchema = new mongoose.Schema({
    _id: String,

    candidate: {
        civilite: String,
        nom: String,
        prenom: {type: String, trim: true},
        nom_d_naiss: String,
        dept_d_naiss: String,
        ville_d_naiss: String,
        pays_d_naiss: String,
        nationalite: String,
        date_d_naiss: {type: Date},
        adresse: {
            address: String,
            compl_adresse: String,
            pays: String,
            ville: String,
            code_postal: Number,
        },
        contact: {
            telfixe: String,
            telmob: String,
            email: String,
            skype: String,
        }

    },
    father: {
        civilite: String,
        nom: String,
        prenom: String,
        adresse: {
            address: String,
            compl_adresse: String,
            pays: String,
            ville: String,
            code_postal: Number,
        },
        contact: {
            telfixe: String,
            telmob: String,
            email: String,
            skype: String,
            emploi: String,
            employeur: String,
        },

    },
    mother: {
        civilite: String,
        nom: String,
        prenom: String,
        adresse: {
            address: String,
            compl_adresse: String,
            pays: String,
            ville: String,
            code_postal: Number,
        },

        contact: {
            telfixe: String,
            telmob: String,
            email: String,
            skype: String,
            emploi: String,
            employeur: String,
        },

    },
    tutor: {
        civilite: String,
        nom: String,
        prenom: String,
        adresse: {
            address: String,
            compl_adresse: String,
            pays: String,
            ville: String,
            code_postal: Number,
        },

        contact: {
            telfixe: String,
            telmob: String,
            email: String,
            skype: String,
            emploi: String,
            employeur: String,
        },

    },
    cursus: {

        last: {
            year: String,
            precisez: String,
            school: String,
            adresse: {
                address: String,
                compl_adresse: String,
                pays: String,
                ville: String,
                code_postal: Number,
            },
            class: String,
            speciality: String,
            level: String,
            other: String,
        },

            previous: {
                year: String,
                precisez: String,
                school:String,
                adresse: {
                    address: String,
                    compl_adresse: String,
                    pays: String,
                    ville: String,
                    code_postal: Number,
                },
                class: String,
                speciality: String,
                level: String,
                other: String,
            },

        },
    wish:{
        year: String,
        cursus: String,
        precisez: String,
        campus : String,
        message : String
    },

    });


var Dossier = mongoose.model('Dossier', dossierSchema);

module.exports = Dossier;