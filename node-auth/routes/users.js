var express = require('express');
const app = express();
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
  res.render('register', {
    'title': 'Register'
  })
});

router.post('/register', function (req, res) {
  // get the form values
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;

  // check for image field
  if (req.body.profileimage) {
    console.log('Uploading Image .......')
    // file info
    let profileImageOriginalName = req.files.profileImage.orginalname;
    let profileImageName = req.files.profileImage.name;
    let profileImageMime = req.files.profileImage.mimetype;
    let profileImagePath = req.files.profileImage.path;
    let profileImageExt = req.files.profileImage.extention;
    let profileImageSize = req.files.profileImage.size;
  } else {
    // set default image
    var profileImageName = 'noimage.png';

  }
  let messages = {
    nameMsg: 'Name Field is required',
    emailMsg: 'Email Field is required',
    usernameMsg: 'Username Field is required',
    passwordMsg: 'Password Field is requied',
    password2Msg: 'Password do not match'

  }

  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Not a valid email').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Checks for errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });

    // Create user
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);
    });

    // Success message
    req.flash('success', 'You are now registered and may now log in.');

    res.location('/');
    res.redirect('/');
  }
});










router.get('/login', function (req, res, next) {
  res.render('login.ejs', {
    'title': 'Login'
  })
});

module.exports = router;
