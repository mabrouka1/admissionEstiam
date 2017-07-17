var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Mother = new keystone.List('Mother',{
    map : {name : 'nom'}
});


Mother.add(
    {
        civilite: {type: String},
        nom: {type: String,},
        prenom: {type: String,},
        adresse: {type: Types.Relationship, ref: 'Adresse',},
        contact: {type: Types.Relationship, ref: 'ContactParents',},
    });

Mother.register();
module.exports = Mother;
