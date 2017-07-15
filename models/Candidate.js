var mongoose = require('mongoose');
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Candidate = new keystone.List('Candidate', {
        map : {name : 'nom'}
});

Candidate.add(
    {
        civilite: {type: String},
        nom: {type: String},
        prenom: {type: String},
        nom_d_naiss: {type: String},
        dept_d_naiss: {type: String},
        ville_d_naiss: {type: String},
        pays_d_naiss: {type: String},
        nationalite: {type: String},
        date_d_naiss: {type: Types.Date},
        adresse: {type: Types.Relationship, ref: 'Adresse', many: false},
        contact: {type: Types.Relationship, ref: 'Contact', many: false},

    });
Candidate.register();

module.exports = Candidate;