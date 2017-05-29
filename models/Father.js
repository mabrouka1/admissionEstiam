var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Father = new keystone.List('Father');


Father.add(
    {
        civilite: {type: String},
        nom: {type: Types.Name,},
        prenom: {type: String,},
        adresse: {type: Types.Relationship, ref: 'Adresse',},
        contact: {type: Types.Relationship, ref: 'ContactParents',},

    });

Father.register();

module.exports = Father;
