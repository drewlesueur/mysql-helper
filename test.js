(function() {
  var Client, MySqlHelper, client, config, createTable, db, dropTable, insertRow, queryInsert, queryUpdate, updateRow, useDb, _;
  _ = require("underscore");
  config = require("./config");
  Client = require("mysql").Client;
  require("drews-mixins")(_);
  MySqlHelper = require("mysql-helper").MySqlHelper;
  client = new Client();
  client.user = config.user;
  client.password = config.password;
  client.host = config.host;
  client.connect();
  db = new MySqlHelper(client);
  useDb = function(done) {
    return db.query("USE " + config.db, function(err) {
      return done(err);
    });
  };
  dropTable = function(done) {
    return db.query("drop table if exists tests", function(err) {
      _.assertEqual(err, null, "should drop table");
      return done(err);
    });
  };
  createTable = function(done) {
    return db.query("CREATE TABLE tests (\n  id integer auto_increment primary key,\n  name varchar(255),\n  email varchar(255)\n)", function(err) {
      _.assertEqual(err, null, "should not error creating table");
      return done();
    });
  };
  insertRow = function(done) {
    return db.insert("tests", {
      'name': "Drew",
      'email': "drewalex@gmail.com"
    }, function(err) {
      _.assertEqual(err, null, "no error on insert");
      return done(err);
    });
  };
  queryInsert = function(done) {
    return db.query("SELECT * FROM tests where name=?", ['drew'], function(err, results) {
      var eq, expectedRow;
      _.assertEqual(err, null, "querying should not have error");
      expectedRow = {
        'id': 1,
        'name': 'Drew',
        email: 'drewalex@gmail.com'
      };
      eq = _.isEqual(results[0], expectedRow);
      _.assertEqual(eq, true, "querying should get expected results");
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
      return db.query("SELECT * FROM tests where name=?", ['drew'], function(err, results) {
        _.assertEqual(err, null, "querying drews results should not have error");
        _.assertEqual(results.length, 0, "no results with drew now");
        return done(err, results);
      });
    };
    aterciopeladosResults = function(done) {
      return db.query("SELECT * FROM tests where name=?", ['aterciopelados'], function(err, results) {
        _.assertEqual(err, null, "querying aterciopelados should not have error");
        _.assertEqual(results.length, 1, "no results with drew now");
        return done(err, results);
      });
    };
    return _.parallel([drewsResults, aterciopeladosResults], function(err, results) {
      var atercios;
      _.assertEqual(err, null, "getting results no error");
      _.assertEqual(results[0].length, 0, "drew is no longer there");
      atercios = _.isEqual(results[1][0], {
        id: 1,
        name: 'Aterciopelados',
        email: 'drewalex@gmail.com'
      });
      console.log(results[1][0]);
      _.assertEqual(atercios, 1);
      return done(err);
    });
  };
  _.series([useDb, dropTable, createTable, insertRow, queryInsert, updateRow, queryUpdate, dropTable], function(err, results) {
    console.log("tests done");
    console.log("" + (_.getAssertCount()) + " tests ran\n" + (_.getPassCount()) + " tests passed");
    return client.end();
  });
}).call(this);
