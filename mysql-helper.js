(function() {
  var MySqlHelper;
  var __slice = Array.prototype.slice;
  MySqlHelper = (function() {
    function MySqlHelper(client) {
      this.client = client;
    }
    MySqlHelper.prototype.insert = function(table, hash, callback) {
      var actualValues, fields, fieldsStr, insert, key, value, values, valuesStr;
      insert = "INSERT INTO " + table;
      fields = [];
      values = [];
      actualValues = [];
      for (key in hash) {
        value = hash[key];
        fields.push("`" + key + "`");
        values.push("?");
        fieldsStr = fields.join(", ");
        valuesStr = values.join(", ");
        actualValues.push(value);
      }
      insert = "" + insert + " (" + fieldsStr + ") VALUES (" + valuesStr + ")";
      return this.client.query(insert, actualValues, callback);
    };
    MySqlHelper.prototype.query = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.client).query.apply(_ref, args);
    };
    MySqlHelper.prototype.update = function(table, values, where, callback) {
      var actualValues, key, setStr, sets, update, value, wheres, wheresStr;
      update = "UPDATE `" + table + "` set ";
      sets = [];
      actualValues = [];
      wheres = [];
      for (key in values) {
        value = values[key];
        sets.push("`" + key + "`=?");
        actualValues.push(value);
      }
      for (key in where) {
        value = where[key];
        wheres.push("`" + key + "`=?");
        actualValues.push(value);
      }
      setStr = sets.join(", ");
      wheresStr = wheres.join(" AND ");
      return this.client.query("" + update + " " + setStr + " WHERE " + wheresStr, actualValues, callback);
    };
    return MySqlHelper;
  })();
  module.exports.MySqlHelper = MySqlHelper;
}).call(this);
