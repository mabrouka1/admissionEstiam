var keystone = require('keystone'),
    User = keystone.list('Admin');

exports = module.exports = function(done) {
    new User.model({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin',
        isAdmin: true
    }).save(done);
};