var keystone = require('keystone');
var mongoose = require('mongoose');
var deepPopulate  = require('mongoose-deep-populate')(mongoose);
var Types = keystone.Field.Types;

var Dossier = new keystone.List('Dossier');

Dossier.add({
    candidate: {type: Types.Relationship, ref: 'Candidate', many: false},
    father: {type: Types.Relationship, ref: 'Father', many: false},
    mother: {type: Types.Relationship, ref: 'Mother', many: false},
    tutor: {type: Types.Relationship, ref: 'Tutor', many: false},
    cursus: {type: Types.Relationship, ref: 'Cursus', many: false},
    files: {type: Types.Relationship, ref: 'Files', many: false},
    wish: {type: Types.Relationship, ref: 'Wish', many: false},
    status: {type: String, default: 'Created'},

});
Dossier.schema.add({_id: String});
Dossier.schema.plugin(deepPopulate);

Dossier.defaultColumns = 'candidate, status';


Dossier.register();

module.exports = Dossier;