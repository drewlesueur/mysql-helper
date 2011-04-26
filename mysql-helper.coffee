class MySqlHelper
  constructor: (client) ->
    @client = client
  insert: (table, hash, callback) ->
    insert = "INSERT INTO #{table}"
    fields = []
    values = []
    actualValues = []
    for key, value of hash
      fields.push "`#{key}`"
      values.push  "?"
      fieldsStr = fields.join ", "
      valuesStr = values.join ", "
      actualValues.push value
    insert = "#{insert} (#{fieldsStr}) VALUES (#{valuesStr})"
    @client.query insert, actualValues, callback
  query: (args...) ->
    @client.query args... 
  update: (table, values, where, callback) ->
    update = "UPDATE `#{table}` set "
    sets = []
    actualValues = []
    wheres = []
    for key, value of values
      sets.push "`#{key}`=?"
      actualValues.push value
    for key, value of where
      wheres.push "`#{key}`=?"
      actualValues.push value
    setStr = sets.join ", "
    wheresStr = wheres.join " AND "
    @client.query "#{update} #{setStr} WHERE #{wheresStr}", actualValues, callback 

module.exports.MySqlHelper = MySqlHelper
