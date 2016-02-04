var settings = require('../settings');
var mysql = require('mysql');
module.exports = mysql.createPool({
    host: settings.host,
    user: settings.user,
    password: settings.password,
    database:settings.database,
    port: settings.port
});
