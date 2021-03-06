//=============================================================================
//Import Required Modules =====================================================
//=============================================================================

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let routes = require('./server/routes/index');
let users = require('./server/routes/users');

//=============================================================================
//Import the comments controller from controllers folder ======================
//=============================================================================
let comments = require('./server/controllers/comments');


//=============================================================================
//ORM with Mongoose ===========================================================
//=============================================================================
let mongoose = require('mongoose');
//Modules to store session ====================================================
let session = require ('express-session');
let MongoStore = require ('connect-mongo')(session);
//Import Passport and Warning flash modules ===================================
let passport = require ('passport');
let flash = require ('connect-flash');



//=============================================================================
//Make sure that express is initiated =========================================
//=============================================================================
let app = express();

// view engine setup  =========================================================
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');

//=============================================================================
//Database configuration  =====================================================
//=============================================================================

//Get the mongoDB path from the config.js file ================================
let config = require('./server/config/config');
//Connect to our database =====================================================
mongoose.connect(config.url);
//Check if MongoDB is running =================================================
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

//=============================================================================
//Setup public directory  =====================================================
//=============================================================================
app.use(express.static(path.join(__dirname, 'public')));


//=============================================================================
//Required for passport  ======================================================
//Secret for session  =========================================================
//=============================================================================

app.use(session({
  secret:'somerandomtextgohere',
  saveUninitialized: true,
  resave: true,
//store session on MongoDB using express-session + connect mongo ==============
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
//=============================================================================
// Add the comments route =====================================================
//=============================================================================
app.get('/comments', comments.hasAuthorization, comments.list);
app.post('/comments', comments.hasAuthorization, comments.create);
//=============================================================================
// catch 404 and forward to error handler =====================================
//=============================================================================
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


//=============================================================================
// Development error handler will print stack trace ===========================
//=============================================================================
if(app.get('env') === 'development'){
  app.use((err, req, res, next)  =>{
    res.status(err.status || 500);
    res.render('error', {
      message:err.message,
      error: err
    });
  });
}


//=============================================================================
// Production error handler no stack trace leaked to user =====================
//=============================================================================
app.use((err, req, res, next) =>{
  res.status(err.status || 500);
  res.render('error',{
      message:err.message,
      error:{}
  });
});


module.exports = app;

app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), () => {
  console.log("Express is listening on port "+ server.address().port)
});
