var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Dossier = new keystone.List('Dossier');

Dossier.add({
    candidate: {type: Types.Relationship, ref: 'Candidate',},
    father: {type: Types.Relationship, ref: 'Father',},
    mother: {type: Types.Relationship, ref: 'Mother',},
    tutor: {type: Types.Relationship, ref: 'Tutor',},
    files: {type: Types.Relationship, ref: 'Files',},
    wish: {type: Types.Relationship, ref: 'Wish',},
    status: {type: String, default: 'Created'},

});
Dossier.schema.add({_id: String});

Dossier.register();

module.exports = Dossier;