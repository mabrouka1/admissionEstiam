var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Tutor = new keystone.List('Tutor');

Tutor.add(
    {
        civilite: {type: String},
        nom: {type: Types.Name,},
        prenom: {type: String,},
        adresse: {type: Types.Relationship, ref: 'Adresse',},
        contact: {type: Types.Relationship, ref: 'ContactParents',},
    });




Tutor.register();
module.exports = Tutor;

