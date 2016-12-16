let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express from server folder' });
});

/* GET login page */
router.get('/login', (req, res, next) => {
  res.render('login', {
    title:"Login Page",
    message: req.flash('loginMessage')
  });
});

/* GET Signup page */
router.get('/signup', (req, res) => {
   res.render('signup',
       {
       title:"Signup Page",
       message: req.flash('signupMessage')
       }
   )
});

/* GET Profile page */
router.get('/profile', (req, res, next) => {
   res.render('profile',
       {
       title:"Profile Page",
       user: req.user,
       avatar: gravatar.url(rea.user.email,{
           s:'100',
           r:'x',
           d:'retro'
       },
       true)
       });
});
module.exports = router;
