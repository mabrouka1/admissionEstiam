var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Adresse = new keystone.List('Adresse');

Adresse.add({
    address: {type: String},
    compl_adresse: {type: String},
    pays: {type: String},
    ville: {type: String},
    code_postal: {type: Types.Number},
});
Adresse.register();

module.exports = Adresse;