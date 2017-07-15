var _ = require('lodash');
var passport = require('passport');
var request = require('request');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.model.findById(id, function(err, user) {
        done(err, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {
    User.model.findOne({$or: [{email: username.toLowerCase()}, {username: username.toLowerCase()}]}, function(err, user) {

        if (!user) {
            return done(null, false, { msg: 'Username / Email ' + username + ' not found.' });
        }
        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { msg: 'Invalid email or password.' });
            }
        });
    });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

