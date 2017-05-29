var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Academy = new keystone.List('Academy');

Academy.schema.add({
    last_report: {type: Object},
    prev_report: {type: Object},
    high_diploma: {type: Object},

});
Academy.register();

module.exports = Academy;