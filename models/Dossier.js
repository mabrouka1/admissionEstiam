var mongoose = require('mongoose');

var dossierSchema = new mongoose.Schema({
    civilite: {
        nom: String,
        prenom: { type: String, trim: true },
        nom_d_naiss: String,
        dept_d_naiss:  Number,
        ville_d_naiss: String,
        date_d_naiss: { type: Number, min: 0 },
    },

        adresse:{
            address:String,
            compl_adresse:String,
            pays:String,
            ville:String,
            code_postal: Number,
        },
        contact:{
            telfixe:{ type: Number, min: 0 },
            telmob:{ type: Number, min: 0 },
            email: String,
            skype: String,
        },



    father:{
        civilite: String,
        nom: String,
        prenom: String,
        adresse: String,
        compl_adresse: String,
        pays: String,
        ville: String,
        code_postal: Number,

        contact:{
            telfixe:{ type: Number, min: 0 },
            telmob:{ type: Number, min: 0 },
            email: String,
            skype: String,
            emploi: String,
            employeur : String,
        },

    },
    mother:{
        civilite: String,
        nom: String,
        prenom: String,
        adresse: String,
        compl_adresse: String,
        pays: String,
        ville: String,
        code_postal: Number,

        contact:{
            telfixe:{ type: Number, min: 0 },
            telmob:{ type: Number, min: 0 },
            email: String,
            skype: String,
            emploi: String,
            employeur : String,
        },

    },
    tutor:{
        civilite: String,
        nom: String,
        prenom: String,
        adresse: String,
        compl_adresse: String,
        pays: String,
        ville: String,
        code_postal: Number,

        contact:{
            telfixe:{ type: Number, min: 0 },
            telmob:{ type: Number, min: 0 },
            email: String,
            skype: String,
            emploi: String,
            employeur : String,
        },

    },

});





var Dossier = mongoose.model('Dossier', dossierSchema);

module.exports = Dossier;