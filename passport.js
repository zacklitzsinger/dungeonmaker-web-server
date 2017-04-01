var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");
const saltRounds = 10;

var db = require("./model/db");


passport.use(new LocalStrategy(
  function(username, password, done) {
    var user = db.get("users").get(username).value();
    if (!user) { return done(new Error("user not found")); }
    bcrypt.compare(password, user.password, function(err, valid){
      if (err) { return done(err); }
      if (!valid) { return done(new Error("invalid password")); }
      return done(null, user);
    })
  }
));

passport.serializeUser(function(user, done) {
  if (!user) { return done(new Error("no user provided")); }
  return done(null, user.username);
});

passport.deserializeUser(function(username, done){
  if (!username) { return done(new Error("no username provided")); }
  var user = db.get("users").get(username).value();
  if (!user){
    return done(new Error("could not find user with username: " + username));
  }
  return done(null, user);
})

module.exports = passport;
