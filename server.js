var express = require("express"),
  app = express(),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler'),
  methodOverride = require('method-override'),
  hostname = 'localhost',
  port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
  publicDir = __dirname + '/public';

var location = 'local';
if (process.env.OPENSHIFT_NODEJS_IP) {
  location = 'openshift';
  hostname = process.env.OPENSHIFT_NODEJS_IP;
}

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("[%s] Serving files: '%s' to http://%s:%s", location, publicDir, hostname, port);

app.listen(port, hostname);