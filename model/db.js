var lowdb = require("lowdb");
var fileAsync = require("lowdb/lib/storages/file-async");

var db = lowdb("db.json", {storage: fileAsync});

db.defaults({
  levels: [],
  levelInfo: {},
  users: {}
}).write();

module.exports = db;
