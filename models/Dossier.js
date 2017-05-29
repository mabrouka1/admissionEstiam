var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Dossier = new keystone.List('Dossier'),
    Files = new keystone.List('Files'),
    Wish = new keystone.List('Wish'),
    Contact = new keystone.List('Contact'),
    ContactParents = new keystone.List('ContactParents', {inherits: Contact}),
    Sejour = new keystone.List('Sejour'),
    Academy = new keystone.List('Academy'),
    Identity = new keystone.List('Identity');


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




Contact.add({
    telfixe: {type: String},
    telmob: {type: String},
    email: {type: Types.Email,},
    skype: {type: String},
});


ContactParents.add({
    emploi: {type: String},
    employeur: {type: String},
})




Identity.schema.add({
    document: {type: String},
    number: {type: String},
    date: {type: Date},
    file: {type: Object},
});

Sejour.schema.add({
    number: {type: String},
    date: {type: Date},
    file: {type: String},
});
Academy.schema.add({
    last_report: {type: Object},
    prev_report: {type: Object},
    high_diploma: {type: Object},

});

Files.add({

    identity: {type: Types.Relationship, ref: 'Identity',},
    sejour: {type: Types.Relationship, ref: 'Sejour',},
    academy: {type: Types.Relationship, ref: 'Academy',},

});


Wish.add({
    year: {type: String},
    cursus: {type: String},
    precisez: {type: String},
    campus: {type: String},
    message: {type: String},

});





Dossier.register();

Contact.register();
ContactParents.register();

Files.register();
Wish.register();
Sejour.register();
Academy.register();
Identity.register();


module.exports = Dossier;