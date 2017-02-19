var express = require("express");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var lowdb = require("lowdb");
var fileAsync = require("lowdb/lib/storages/file-async");

var db = lowdb("db.json", {storage: fileAsync});

var app = express();
var upload = multer({dest: "levels"});

app.get("/", function (req, res) {
  res.send("DM web server");
});

app.post("/levels", upload.single("level"), function (req, res) {
  var levelName = req.body.levelName;
  var levelInfo = {};
  var oldFilename = db.get("levelInfo").get(levelName).get("__filename").value();
  if (oldFilename != null && fs.existsSync(path.join("levels", oldFilename)))
  {
    fs.unlinkSync(path.join("levels", oldFilename));
  }
  levelInfo[levelName] = {
    name: levelName,
    author: req.body.author,
    description: req.body.description,
    size: req.file.size,
    __filename: req.file.filename
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

app.get("/levels", function (req, res) {
  res.json(db.get("levelInfo").value());
});

app.get("/levels/:name", function (req, res) {
  var levelName = req.params.name;
  var info = db
    .get("levelInfo")
    .get(levelName)
    .omitBy(function(key) { return key[0] == "_"; })
    .value();
  res.json(info);
});

app.get("/levels/download/:name", function ( req, res) {
  var levelName = req.params.name;
  var filename = db.get("levelInfo").get(levelName).get("__filename").value();
  res.sendFile(path.join(__dirname, "levels", filename));
});

db.defaults({levels: [], levelInfo: {}})
  .write()
  .then(function () {
    app.listen(3000, function () {
      console.log("DM Web Server listening on port 3000!");
    })
  });
