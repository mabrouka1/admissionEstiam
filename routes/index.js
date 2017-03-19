var express = require('express');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');

var passport = require('passport');
var User = require('../models/User');
var mongoose = require('mongoose');
var nev = require('email-verification')(mongoose);


// generating the model, pass the User model defined earlier
nev.generateTempUserModel(User, function (err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

/**
 *  Email verification config
 */

nev.configure({
    verificationURL: process.env.URL + '/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'temporary_users',

    transportOptions: {
        service: process.env.EmailService,
        auth: {
            user: process.env.EmailUser,
            pass: process.env.EmailPass
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    }
}, function (error, options) {
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Admission Estiam - Bienvenue'});
});


/* POST Login / Register page. */
router.post('/signin', function (req, res, next) {

    req.assert('username', 'username cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();


    var errors = req.validationErrors();

    if (errors) {
        for (err in errors) {
            if (errors.hasOwnProperty(err)) {
                req.flash('error', errors[err].msg);
            }
        }

        return res.redirect('/');
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            for (inf in info) {
                if (info.hasOwnProperty(inf)) {
                    req.flash('info', info[inf].msg);
                }
            }
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Success! You are logged in.');
            res.redirect(req.session.returnTo || '/users');
        });
    })(req, res, next);

});
router.post('/signup', function (req, res, next) {

    req.assert('username', 'Username must be at least 4 characters long').len(4);
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({remove_dots: false});

    var errors = req.validationErrors();

    if (errors) {
        for (err in errors) {
            if (errors.hasOwnProperty(err)) {
                req.flash('error', errors[err].msg);
            }
        }

        return res.redirect('/');
    }

    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });


    User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, function (err, existingUser) {
        if (existingUser) {
            req.flash('error', 'Account with that email address already exists.');
            return res.redirect('/');
        }


        nev.createTempUser(user, function (err, existingPersistentUser, newTempUser) {
            // some sort of error
            if (err) return next(err); // handle error...

            // user already exists in persistent collection...
            if (existingPersistentUser) {
                req.flash('error', 'Account with that email address or username already exists.');
                return res.redirect('/');
            }
            // handle user's existence... violently.

            // a new user
            if (newTempUser) {
                var URL = newTempUser[nev.options.URLFieldName];
                nev.sendVerificationEmail(req.body.email, URL, function (err, info) {
                    if (err) return next(err); // handle error...

                    req.flash('success', 'Account Created Please confirm your email address .');
                    return res.redirect('/');
                });

            } else {
                // user already exists in temporary collection...
                req.flash('error', 'Account with that email address or username already exists.');
                return res.redirect('/');
            }
        });
    });

});

// user accesses the link that is sent
router.get('/email-verification/:URL', function (req, res, next) {
    var url = req.params.URL;

    nev.confirmTempUser(url, function (err, user) {
        if (user) {
            nev.sendConfirmationEmail(user.email, function (err, info) {
                if (err) {
                    req.flash('error', 'Sending confirmation email FAILED');
                    return res.redirect('/');
                }
                req.flash('success', 'Account Activated.');

                return res.redirect('/');

            });
        } else {
            req.flash('error', 'confirming temp user FAILED');
            return res.redirect('/');
        }
    });
});
router.get('/signout', function (req, res, next) {
    req.logout();
    req.flash('success', 'Success! You are logged out.');
    res.redirect('/');

});
router.post('/forgot', function (req, res, next) {

});
module.exports = router;


