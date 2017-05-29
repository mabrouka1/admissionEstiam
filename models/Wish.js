var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Wish = new keystone.List('Wish');


Wish.add({
    year: {type: String},
    cursus: {type: String},
    precisez: {type: String},
    campus: {type: String},
    message: {type: String},

});

Wish.register();

module.exports = Wish;
