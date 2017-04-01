var express = require('express');
var router = express.Router();
var passport = require("../passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Login
router.post("/login", passport.authenticate("local"), function(req, res){
  res.send();
});

router.post("/logout", function(req, res) {
  req.session.destroy();
  res.send();
})

module.exports = router;
