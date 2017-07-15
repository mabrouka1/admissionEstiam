var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Identity = new keystone.List('Identity',{
    map : {name : 'number'}
});

Identity.schema.add({
    document: {type: String},
    number: {type: String},
    date: {type: Date},
    file: {type: Object},
});

Identity.register();

module.exports = Identity;
