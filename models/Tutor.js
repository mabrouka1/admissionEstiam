var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Tutor = new keystone.List('Tutor',{
    map : {name : 'nom'}
});

Tutor.add(
    {
        civilite: {type: String},
        nom: {type: String,},
        prenom: {type: String,},
        adresse: {type: Types.Relationship, ref: 'Adresse',},
        contact: {type: Types.Relationship, ref: 'ContactParents',},
    });




Tutor.register();
module.exports = Tutor;

