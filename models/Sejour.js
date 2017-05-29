var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Sejour = new keystone.List('Sejour');

Sejour.schema.add({
    number: {type: String},
    date: {type: Date},
    file: {type: String},
});
Sejour.register();

module.exports = Sejour;