var express = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
const path = require('path');
var Twit = require('twit');

var trustProxy = 1;

passport.use(new Strategy({
  consumerKey: '...',
  consumerSecret: '...',
  callbackURL: '/oauth/callback',
  proxy: trustProxy
},
  function (token, tokenSecret, profile, cb) {
    // TWIT ##################################################################
    var T = new Twit({
      consumer_key: '...',
      consumer_secret: '...',
      access_token: token,
      access_token_secret: tokenSecret
    })

    //  tweet 'hello world!'
    app.get('/sendtweet', (req, res) => {
      T.post('statuses/update', { status: req.query.text }, function (err, data, response) {
        console.log(data);
      });
      res.redirect('/');
    })

    //
    //
    // TWIT ##################################################################

    return cb(null, profile);
  }));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'peanut butter',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', () => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/checkstat', (req, res) => {
  res.json(req.user);
});

app.get('/login/twitter',
  passport.authenticate('twitter')
);

app.get('/oauth/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  });

app.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy(function (err) {
    if (!err) {
      res.status(200).clearCookie('connect.sid', { path: '/' });
      res.redirect('/');
    } else {
      // handle error case...
    }

  });
});

app.get('/querytest', function(req, res){
  console.log(req.query.name);
  res.send('Response send to client::'+req.query.name);

});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

app.listen(5000, () => {
  console.log('Running on http://localhost:5000')
});