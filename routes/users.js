var express = require("express");
var router = express.Router();
var passport = require("../passport");
var bcrypt = require("bcrypt");
const saltRounds = 10;

var util = require("../util");

var db = require("../model/db");

// Create a user
router.put("/:username", function (req, res) {
  var username = req.params.username;
  var password = req.body.password;
  if (!password || password.length == 0)
    return res.status(400).send();
  bcrypt.hash(password, saltRounds)
  .then(function(hash){
    var userObj = {};
    userObj[username] = {
      username: username,
      password: hash
    };
    db.get("users")
    .assign(userObj)
    .write()
    .then(function() {
      res.send();
    });
  })
});

router.get("/:username", util.requireAuth, function (req, res) {
  var username = req.params.username;
  if (!username || username.length == 0)
    return res.status(400).send();
  var user = db.get("users")
  .get(username)
  .omitBy(util.isPrivate)
  .value();
  res.json(user);
});

// Login
router.post("/login", passport.authenticate('local'), function(req, res){
  res.send();
});

router.post("/logout", function(req, res) {
  req.session.destroy();
  res.send();
})

module.exports = router;
