var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Mother = new keystone.List('Mother');


Mother.add(
    {
        civilite: {type: String},
        nom: {type: Types.Name,},
        prenom: {type: String,},
        adresse: {type: Types.Relationship, ref: 'Adresse',},
        contact: {type: Types.Relationship, ref: 'ContactParents',},
    });

Mother.register();
module.exports = Mother;
