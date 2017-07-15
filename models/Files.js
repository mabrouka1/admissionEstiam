var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Files = new keystone.List('Files');

Files.add({
    identity: {type: Types.Relationship, ref: 'Identity',},
    sejour: {type: Types.Relationship, ref: 'Sejour',},
    academy: {type: Types.Relationship, ref: 'Academy',},

});

Files.register();
module.exports = Files;