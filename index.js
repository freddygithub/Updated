// Main Server
// ENVIRONMENT VARIABLES
require('dotenv').config();

// Initialization ============================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 80;
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// setup express =============================================================
app.use(morgan('dev')); //log all requests
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use('/css', express.static(__dirname + "/css"));
app.use('/vendor', express.static(__dirname + "/vendor"));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + "/js"));

// passport configuration ====================================================
app.use(session({ secret: 'ZWNoZWxvbndlYmFkbWluYXBp', saveUninitialized : false}));
app.use(flash());

// routes ====================================================================
app.use('/', require('./app/routes.js'));

// launch ====================================================================
var server = app.listen(port);

console.log('Reflect Signup running on port ' + port);