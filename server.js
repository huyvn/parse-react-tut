var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');
var app = express();

var proxy = httpProxy.createProxyServer();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 9001;

app.set('port', port);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (!isProduction){
  var bundle = require('./server/bundle.js');
  bundle();

  // Any requests to /build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:9000'
    });
  });
}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(app.get('port'), function() {
  console.log('ParseReact Tutorial');
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});