var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const saltRounds = 10;

var util = require("../util");

var db = require("../model/db");

// Create a user
router.post("/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!password || password.length == 0)
    return res.status(400).send(new Error("no password sent"));
  var existingUser = db.get("users").get(username).value();
  if (existingUser)
    return res.status(400).send(new Error("username taken"));
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

// Read a user
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

module.exports = router;
