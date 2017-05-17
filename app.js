var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo/es5')(session);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var nev = require('email-verification')(mongoose);
var dotenv = require('dotenv');
var errorHandler = require('errorhandler');
var flash = require('express-flash');
var expressValidator = require('express-validator');
var passport = require('passport');
var body = require('body-parser');
var keystone = require('keystone');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: '.env' });


var index = require('./routes/index');
var users = require('./routes/users');

var User = require('./models/User');

/**
 * API keys and Passport configuration.
 */
var passportConfig = require('./config/passport');


var app = express();


/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


app.engine('ejs', engine);
app.set('view engine', 'ejs');
// view engine setup app.set('views', path.join(__dirname, 'views'));

app.locals.moment = require('moment');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



/**
 * Keystone config
 */


keystone.init({
    'name': 'Espace Admin Estiam',
    'brand': 'Espace Admin Estiam',
    'session': false,
    'updates': 'updates',
    'auth': true,
    'user model': 'Admin',
    'auto update': true,
    'cookie secret': process.env.SESSION_SECRET,
});

keystone.import('models');

/**
 * Keystone config
 */






app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB || process.env.MONGOLAB_URI,
        autoReconnect: true
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', index);
app.use('/users',  passportConfig.isAuthenticated,users);
app.use('/keystone', keystone.Admin.Server.createStaticRouter(keystone));
app.use('/keystone', keystone.Admin.Server.createDynamicRouter(keystone));
app.use('/node_modules', express.static('node_modules'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


keystone.app = app;
keystone.start();
/**
 * Keystone config
 */


module.exports = app;
