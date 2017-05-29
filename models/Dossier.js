var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Dossier = new keystone.List('Dossier'),
    ContactParents = new keystone.List('ContactParents', {inherits: Contact});


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






ContactParents.add({
    emploi: {type: String},
    employeur: {type: String},
})










Dossier.register();


ContactParents.register();



module.exports = Dossier;