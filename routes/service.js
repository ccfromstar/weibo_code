var http = require("http");
var https = require("https");


var options = {
    host: 'localhost',
    port: 1339,
    path: '/product/getlist',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

exports.getProductList = function(callback)
{
	console.log("getProductList");
    var req = http.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var productList = JSON.parse(output);
            callback(res.statusCode, productList);
        });
    });

    req.on('error', function(err) {
    	console.log("error: " + err.message);
        //res.send('error: ' + err.message);
    });

    req.end();
};