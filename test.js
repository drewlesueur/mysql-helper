(function() {
  var Client, MySqlHelper, client, config, createTable, db, drews, dropTable, insertRow, queryInsert, queryUpdate, updateRow, useDb, _;
  _ = require("underscore");
  config = require("./config");
  Client = require("mysql").Client;
  drews = require("drews-mixins");
  _.mixin(drews);
  MySqlHelper = require("mysql-helper").MySqlHelper;
  client = new Client();
  client.user = config.user;
  client.password = config.password;
  client.host = config.host;
  console.log(config.user, config.password, config.host);
  client.connect();
  db = new MySqlHelper(client);
  useDb = function(done) {
    db.query("USE " + config.db);
    return done();
  };
  createTable = function(done) {
    return db.query("CREATE TABLE tests (\n  id integer,\n  name varchar(255),\n  email varchar(255)\n)", function(err) {
      _.assertEqual(err, null, "should not error creating db");
      return done();
    });
  };
  insertRow = function(done) {
    return db.insert("tests", {
      'name': "Drew",
      'email': "drewalex@gmail.com"
    }, function(err) {
      _.assertEqual(err, null, "no error on insert");
      return done(err, results);
    });
  };
  queryInsert = function(done) {
    return db.query("SELECT * FROM tests where name=?", ['drew'], function(err, results) {
      _.assertEqual(err, null, "querying should not have error");
      _.assertEqual(_.isEqual(results[0], {
        'id': '1',
        'name': 'drew',
        email: 'drewalex@gmail.com'
      }), true);
      return done(err);
    });
  };
  updateRow = function(done) {
    return db.update("tests", {
      name: "Aterciopelados"
    }, {
      id: 1
    }, function(err) {
      return done(err);
    });
  };
  queryUpdate = function(done) {
    var aterciopeladosResults, drewsResults;
    drewsResults = function(done) {
      db.query("SELECT * FROM tests where name=?", ['drew'], function(err, results) {});
      _.assertEqual(err, null, "querying should not have error");
      _.assertEqual(results.length, null, "no results with drew now");
      return done(err, results);
    };
    aterciopeladosResults = function(done) {
      db.query("SELECT * FROM tests where name=?", ['drew'], function(err, results) {});
      _.assertEqual(err, null, "querying should not have error");
      _.assertEqual(results.length, null, "no results with drew now");
      return done(err, results);
    };
    return _.parallel([drewsResults, aterciopeladosResults], function(err, results) {
      var atercios;
      _.assertEqual(err, null, "getting results no error");
      _.assertEqual(resutls[0], null, "drew is no longer there");
      atercios = _.isEqual(results[1][0], {
        id: '1',
        name: 'Aterciopelados',
        email: 'drewalex@gmail.com'
      });
      _.assertEqual(atercios, 1);
      return done(err);
    });
  };
  dropTable = function(done) {
    return db.query("DROP TABLE tests", function(err) {
      return _.assertEqual(err, null, "should drop table");
    });
  };
  _.series([createTable, insertRow, queryInsert, updateRow, queryUpdate, dropTable], function(err, results) {
    return console.log("tests done");
  });
}).call(this);
