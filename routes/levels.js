var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var path = require("path");

var passport = require("../passport");
var util = require("../util");
var db = require("../model/db");

// Limit uploaded levels to 1MB (huge compared to current level sizes, ~100KB for a large level).
// 40K levels can fit into 5GB, which is the default for AWS server.
var upload = multer({dest: "levels", limits: {fileSize: 1e6}});

router.post("/", upload.single("level"), function (req, res) {
  var levelName = req.body.levelName;
  var levelInfo = {};
  var currentLevel = db.get("levelInfo").get(levelName).value();
  var oldFilename = currentLevel.__filename;
  if (oldFilename != null && fs.existsSync(path.join("levels", oldFilename)))
  {
    fs.unlinkSync(path.join("levels", oldFilename));
  }
  levelInfo[levelName] = {
    name: levelName,
    author: req.session.passport.user,
    description: req.body.description,
    size: req.file.size,
    __filename: req.file.filename,
    plays: 0,
    clears: 0,
    deaths: 0,
    ctime: currentLevel ? currentLevel.ctime : new Date(),
    utime: new Date(),
    comments: [],
    tags: []
  };
  db.get("levels")
  .push(levelName)
  .write()
  .then(function () {
    return db.get("levelInfo")
      .assign(levelInfo)
      .write();
  }).then(function() {
    res.send();
  })
});

router.get("/", util.requireAuth, function (req, res) {
  res.json(db.get("levelInfo").value());
});

router.get("/:name", util.requireAuth, function (req, res) {
  var levelName = req.params.name;
  var info = db
    .get("levelInfo")
    .get(levelName)
    .omitBy(util.isPrivate)
    .value();
  res.json(info);
});

router.get("/download/:name", util.requireAuth, function ( req, res) {
  var levelName = req.params.name;
  var filename = db.get("levelInfo").get(levelName).get("__filename").value();
  res.sendFile(path.join(__dirname, "..", "levels", filename));
});

router.post("/:name/play", util.requireAuth, function(req, res) {
  db.get("levelInfo")
  .get(levelName)
  .update("plays", function(v) { return v + 1; })
  .write()
  .then(function() {
    res.send();
  })
});

router.post("/:name/clear", util.requireAuth, function(req, res) {
  db.get("levelInfo")
  .get(levelName)
  .update("clears", function(v) { return v + 1; })
  .write()
  .then(function() {
    res.send();
  })
});

router.post("/:name/death", util.requireAuth, function(req, res) {
  db.get("levelInfo")
  .get(levelName)
  .update("deaths", function(v) { return v + 1; })
  .write()
  .then(function() {
    res.send();
  })
});

router.post("/:name/comment", util.requireAuth, function(req, res) {
  var poster = req.session.passport.user;
  var levelName = req.params.name;
  var content = req.body.content;
  var comment = {
    username: poster,
    date: new Date(),
    content: content
  };
  db.get("levelInfo")
    .get(levelName)
    .get("comments")
    .push(comment)
    .write()
    .then(function(){
      res.send();
    });
});

module.exports = router;
