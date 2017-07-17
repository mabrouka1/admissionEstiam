var multer = require('multer');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var Sejour = new keystone.List('Sejour', {
    map: {name: 'number'}
});


var storage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: keystone.expandPath('/public/uploads'),
        publicPath: '/uploads/',
    }
});


Sejour.add({
    number: {type: String},
    date: {type: Types.Date},
    file: {
        type: Types.File, storage: storage,
    },
    url: {
        type: Types.Url,
        format: function (url) {
            console.log(url);
            return `<a href="${url}"> ${url} </a>`;
        }
    }
});
Sejour.register();

module.exports = Sejour;