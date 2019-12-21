var Twit = require('twit');
var express = require('express'), session = require('express-session');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const request = require('request');
var passport = require('passport'), TwitterStrategy = require('passport-twitter').Strategy;
var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// var T = new Twit({
//   consumer_key: 'mSYKZhlCQvjRtCNQlf93spOjo',
//   consumer_secret: 'UkgJjMlEbqG5YXoHhRLTrMKnQmSRCEuAazl7jCYqR9lS4M4OwX',
//   access_token: '1207792099942420483-6Ld5fxPsmsulfgjeyhiWlSSSKeDVks',
//   access_token_secret: 'BAwjRDBFminkvppCbdqpkhH3fY7bgTKSb16W9MVy3ZMmm',
//   timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL: true,     // optional - requires SSL certificates to be valid.
// })

// ##################################
// Initialize
// const oauth = OAuth({
//   consumer: {
//       key: 'WOhLbMnmnd0uDcgNrGMAyNRZ3',
//       secret: 'zlE7rgQhNY7k1y1XrvUuVTi1A2puvsEapzHCcWehHTI0M0O3JT',
//   },
//   signature_method: 'HMAC-SHA1',
//   hash_function(base_string, key) {
//       return crypto
//           .createHmac('sha1', key)
//           .update(base_string)
//           .digest('base64')
//   },
// })

// const request_data = {
//   url: 'https://api.twitter.com/oauth/request_token',
//   method: 'POST',
//   data: {},
// }

// // The token is optional for some requests
// const token = {
//   key: '1207792099942420483-AY2LyUmR46R9QrpAVKWwaPnRzhcqOG',
//   secret: 'dqOtFVmHT8YMeQaUz5yCOG4eZNdKPAkkqIR6kIvBHGaCP',
// }

// request(
//   {
//       url: request_data.url,
//       method: request_data.method,
//       form: oauth.authorize(request_data),
//   },
//   function(error, response, body) {
//       console.log(body)
//   }
// )
// ##################################

// ***********************************************************************************
passport.use(new TwitterStrategy({
  consumerKey: 'WOhLbMnmnd0uDcgNrGMAyNRZ3',
  consumerSecret: 'zlE7rgQhNY7k1y1XrvUuVTi1A2puvsEapzHCcWehHTI0M0O3JT',
  callbackURL: "https://www.brunowebdev.com/"
},
  function (token, tokenSecret, profile, done) {
    User.findOrCreate(function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });

    passport.use('token', new TokenStrategy(
      function (consumerKey, done) {
        Consumer.findOne({ key: consumerKey }, function (err, consumer) {
          if (err) { return done(err); }
          if (!consumer) { return done(null, false); }
          return done(null, consumer, consumer.secret);
        });
      },
      function (accessToken, done) {
        AccessToken.findOne({ token: accessToken }, function (err, token) {
          if (err) { return done(err); }
          if (!token) { return done(null, false); }
          Users.findById(token.userId, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            // fourth argument is optional info.  typically used to pass
            // details needed to authorize the request (ex: `scope`)
            return done(null, user, token.secret, { scope: token.scope });
          });
        });
      },
      function (timestamp, nonce, done) {
        // validate the timestamp and nonce as necessary
        done(null, true)
      }
    ));
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
// ***********************************************************************************

// let x = 0;

// T.post('https://api.twitter.com/oauth/request_token', {}, function (err, data, res) {
// x = res.statusCode;  
// console.log(res.request.headers.Authorization);
// })

// app.get('/', function (req, res) {
//   res.sendStatus(x);
//   console.log(x);
// });

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});