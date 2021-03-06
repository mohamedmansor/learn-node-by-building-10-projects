var express = require('express');
const app = express();
var router = express.Router();
var User = require('../models/user')

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

router.post('/register', function (req, res, next) {
  console.log('req', req.body)
  // Get the form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  // Check for image field
  if (req.body.profileimage) {
    console.log('Uploading file...');

    // File info (gets the filename)
    var profileImageOriginalName = req.body.profileimage.originalname;
    var profileImageName = req.body.profileimage.name;
    var profileImageMimeType = req.body.profileimage.mimetype;
    var profileImagePath = req.body.profileimage.path;
    var profileImageExt = req.body.profileimage.extension;
    var profileImageSize = req.body.profileimage.size;
  } else {
    // Set a default image
    var profileImageName = 'noimage.png';
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


  if (errors) {
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
    User.createUser(newUser, function (err, user) {
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

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        console.log('Unknown User');
        return done(null, false, { message: 'Unknown User' });
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Invalid Password');
          return done(null, false, { message: 'Invalid Password' });
        }
      });
    });
  }
));

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: 'Invalid username or password'
}), function (req, res) {
  console.log('Authentication Successful');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
})



module.exports = router;
