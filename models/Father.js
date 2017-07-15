var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Father = new keystone.List('Father',{
    map : {name : 'nom'}
});


Father.add(
    {
        civilite: {type: String},
        nom: {type: String,},
        prenom: {type: String,},
        adresse: {type: Types.Relationship, ref: 'Adresse',many: false},
        contact: {type: Types.Relationship, ref: 'ContactParents',many: false},

    });

Father.register();

module.exports = Father;
