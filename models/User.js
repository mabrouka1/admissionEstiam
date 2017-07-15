var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User');
var Profile = new keystone.List('Profile');


User.add(
    {
        username: {type: String, required: true, initial: true, index: true, unique: true},
        email: {type: Types.Email, initial: true, required: true, index: true, unique: true},
        password: {type: Types.Password, initial: true, required: true},
        passwordResetToken: {type: String, required: false},
        passwordResetExpires: {type: Types.Date, required: false},
        profile: { type: Types.Relationship, ref: 'Profile' , required: false},
    });
User.schema.add({},{timestamp: true});

Profile.add({

            name: {type: Types.Name},
            gender: {type: String},
            location: {type: Types.Location},
            picture: {type: String}

    });

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
    return false;
});

/**
 * Helper method for validating user's password.
 */
User.schema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};

/**
 * Helper method for getting user's gravatar.
 */
User.schema.methods.gravatar = function (size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

User.defaultColumns = 'username, email';
Profile.register();
User.register();


module.exports = User;


