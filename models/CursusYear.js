var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var CursusYear = new keystone.List('CursusYear',{
    map : {name : 'class'}
});

CursusYear.add({
    year: {type: String},
    precisez: {type: String},
    school: {type: String},
    adresse: {type: Types.Relationship, ref: 'Adresse',},
    class: {type: String},
    speciality: {type: String},
    level: {type: String},
    other: {type: String},
});

CursusYear.register();

module.exports = CursusYear;