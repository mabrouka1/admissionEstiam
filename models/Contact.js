var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var  Contact = new keystone.List('Contact');

Contact.add({
    telfixe: {type: String},
    telmob: {type: String},
    email: {type: Types.Email,},
    skype: {type: String},
});
Contact.register();
module.exports = Contact;
