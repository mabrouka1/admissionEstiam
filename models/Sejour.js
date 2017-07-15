var multer = require('multer');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var Sejour = new keystone.List('Sejour',{
    map : {name : 'number'}
});


var storage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: keystone.expandPath('../public/uploads'),
        publicPath: '/public/uploads',
    }
});


Sejour.add({
    number: {type: String},
    date: {type: Types.Date},
    file: {type: Types.File, storage: storage},
});
Sejour.register();

module.exports = Sejour;