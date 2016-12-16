//=============================================================================
//Import Required Modules =====================================================
//=============================================================================

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./server/routes/index');
var users = require('./server/routes/users');

var app = express();

//=============================================================================
//ORM with Mongoose ===========================================================
//=============================================================================
var mongoose = require('mongoose');
//Modules to store session
var session = require ('express-session');
var MongoStore = require ('connect-mongo')(session);
//Import Passport and Warning flash modules
var passport = require ('passport');
var flash = require ('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');

//=============================================================================
//Database configuration  =====================================================
//=============================================================================

var config = require('./server/config/config.js');
//Connect to our database
mongoose.connect(config.url);
//Check if MongoDB is running
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

//Passport configuration
require('./server/config/passport')(passport);

//=============================================================================
//Database configuration END  =================================================
//=============================================================================

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'new-google-favicon-512.png')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


//=============================================================================
//Required for passport  ======================================================
//Secret for session  =========================================================
//=============================================================================

app.use(session({
  secret:'somerandomtextgohere',
  saveUninitialized: true,
  resave: true,
  //store session on MongoDB using express-session + connect mongo
  store: new MongoStore({
    url: config.url,
    collection: "sessions"
  })
}));

//=============================================================================
//Init passport authentication  ===============================================
//=============================================================================
app.use(passport.initialize());

//=============================================================================
//Persistent login sessions  ==================================================
//=============================================================================
app.use(passport.session());

//=============================================================================
//Setup flash as messaging middleware  ========================================
//=============================================================================
app.use(flash());



app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), () => {
  console.log("Express is listening on port "+ server.address().port)
    });
