var express = require('express');
var router = express.Router();
var nodeemailer = require('nodemailer');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('contact', { title: 'Express' });
});

router.post('/send', function (req, res, next) {
  var transporter = nodeemailer.createTransport({
    service: 'GMmail',
    secure: true,
    port: 465,
    auth: {
      user: "techguyinfo@gmail.com",
      pass: "something"
    }
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo" <johndoe@outlook.com>', // sender address
    to: 'mohamedmansor212@gmail.com', // list of receivers
    subject: 'Website Submission', // Subject line
    text: 'You have a new submission with the following details... Name: ' + req.body.name + ', Email: ' + req.body.email + ' Message: ' + req.body.message,
    html: '<p>You got a new submission with the following details...</p><ul><li>Name: ' + req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' + req.body.message + '</li></ul>'
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.redirect('/')
    } else {
      console.log('Message sent' + info.response)
      res.redirect('/');
    }
  })
});

module.exports = router;
