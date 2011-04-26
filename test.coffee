_ = require "underscore"
config = require "./config"
Client = require("mysql").Client
require("drews-mixins") _

MySqlHelper = require("mysql-helper").MySqlHelper
client = new Client()
client.user = config.user
client.password = config.password
client.host = config.host
client.connect() #is this sync or something?

db = new MySqlHelper client


useDb = (done) ->
  db.query "USE #{config.db}", (err) ->
    done(err)

dropTable = (done) ->
  db.query """
    drop table if exists tests
  """, (err) -> 
    _.assertEqual err, null, "should drop table"
    done err

createTable = (done) ->
  db.query """
    CREATE TABLE tests (
      id integer auto_increment primary key,
      name varchar(255),
      email varchar(255)
    )
  """, (err) ->
    _.assertEqual err, null, "should not error creating table"
    done()

insertRow = (done) ->
  db.insert "tests", {
    'name': "Drew"
    'email': "drewalex@gmail.com"
  }, (err) ->
    _.assertEqual err, null, "no error on insert"
    done err

queryInsert = (done) ->
  db.query "SELECT * FROM tests where name=?", ['drew'], (err, results) ->
    _.assertEqual err, null, "querying should not have error"
    expectedRow =  {'id': 1, 'name': 'Drew', email: 'drewalex@gmail.com'}
    eq = _.isEqual results[0], expectedRow
    _.assertEqual eq, true, "querying should get expected results"
    
    done err

updateRow = (done) ->
  db.update "tests", {name: "Aterciopelados"}, {id: 1}, (err) ->
    done err

queryUpdate = (done) ->

  drewsResults = (done) ->
    db.query "SELECT * FROM tests where name=?", ['drew'], (err, results) ->
      _.assertEqual err, null, "querying drews results should not have error"
      _.assertEqual results.length, 0, "no results with drew now"
      done err, results


  aterciopeladosResults = (done) ->
    db.query "SELECT * FROM tests where name=?", ['aterciopelados'], (err, results) ->
      _.assertEqual err, null, "querying aterciopelados should not have error"
      _.assertEqual results.length, 1, "no results with drew now"
      done err, results

  _.parallel [drewsResults, aterciopeladosResults], (err, results) ->
    _.assertEqual err, null, "getting results no error"
    _.assertEqual results[0].length, 0, "drew is no longer there"
    atercios = _.isEqual results[1][0], {id: 1, name: 'Aterciopelados', email: 'drewalex@gmail.com'}
    console.log results[1][0]
    _.assertEqual atercios, 1 
    done err

_.series [
  useDb
  dropTable
  createTable
  insertRow
  queryInsert
  updateRow
  queryUpdate
  dropTable
], (err, results) ->
  
  console.log "tests done"
  console.log """
    #{_.getAssertCount()} tests ran
    #{_.getPassCount()} tests passed
  """
  client.end()

