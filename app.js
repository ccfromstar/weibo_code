var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routeCtrl = require("./routes/ctrl");
controllers = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon(__dirname +'/public/images/favicon.ico'));
//app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(partials());

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.session({ secret: "keyboard cat" }));

//文件上传路径
app.use(express.bodyParser({uploadDir:'./public/files'}));

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.router(routes));
routeCtrl(app, controllers);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8088);
console.log("8088 start");

process.on('uncaughtException', function(err){
	console.log(err);
});

module.exports = app;
