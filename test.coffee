_ = require "underscore"
config = require "./config"
Client = require("mysql").Client
drews = require("drews-mixins")
_.mixin drews

MySqlHelper = require("mysql-helper").MySqlHelper
client = new Client()
client.user = config.user
client.password = config.password
client.host = config.host
console.log config.user, config.password, config.host
client.connect() #is this sync or something?

db = new MySqlHelper client


useDb = (done) ->
  db.query "USE #{config.db}"
  done()


createTable = (done) ->
  db.query """
    CREATE TABLE tests (
      id integer,
      name varchar(255),
      email varchar(255)
    )
  """, (err) ->
    _.assertEqual err, null, "should not error creating db"
    done()

insertRow = (done) ->
  db.insert "tests", {
    'name': "Drew"
    'email': "drewalex@gmail.com"
  }, (err) ->
    _.assertEqual err, null, "no error on insert"
    done err, results

queryInsert = (done) ->
  db.query "SELECT * FROM tests where name=?", ['drew'], (err, results) ->
    _.assertEqual err, null, "querying should not have error"
    _.assertEqual _.isEqual(results[0], {'id': '1', 'name': 'drew', email: 'drewalex@gmail.com'}), true
    done err

updateRow = (done) ->
  db.update "tests", {name: "Aterciopelados"}, {id: 1}, (err) ->
    done err

queryUpdate = (done) ->

  drewsResults = (done) ->
    db.query "SELECT * FROM tests where name=?", ['drew'], (err, results) ->
    _.assertEqual err, null, "querying should not have error"
    _.assertEqual results.length, null, "no results with drew now"
    done err, results


  aterciopeladosResults = (done) ->
    db.query "SELECT * FROM tests where name=?", ['drew'], (err, results) ->
    _.assertEqual err, null, "querying should not have error"
    _.assertEqual results.length, null, "no results with drew now"
    done err, results

  _.parallel [drewsResults, aterciopeladosResults], (err, results) ->
    _.assertEqual err, null, "getting results no error"
    _.assertEqual resutls[0], null, "drew is no longer there"
    atercios = _.isEqual results[1][0], {id: '1', name: 'Aterciopelados', email: 'drewalex@gmail.com'}
    _.assertEqual atercios, 1 

    done err


dropTable = (done) ->
  db.query """
   DROP TABLE tests
  """, (err) ->
    _.assertEqual err, null, "should drop table"
 

  
_.series [
  createTable
  insertRow
  queryInsert
  updateRow
  queryUpdate
  dropTable
], (err, results) ->
  console.log "tests done"

