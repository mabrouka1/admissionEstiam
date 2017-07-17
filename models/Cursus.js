var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Cursus = new keystone.List('Cursus',{
    map : {name : 'last'}
});

Cursus.add({
    last:  {type: Types.Relationship, ref: 'CursusYear',},
    previous:  {type: Types.Relationship, ref: 'CursusYear',},
});

Cursus.register();

module.exports = Cursus;
