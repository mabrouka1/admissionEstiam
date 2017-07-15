var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Contact = require('./Contact');

var ContactParents = new keystone.List('ContactParents', {inherits: Contact});

ContactParents.add({
    emploi: {type: String},
    employeur: {type: String},
});

ContactParents.register();

module.exports = ContactParents;