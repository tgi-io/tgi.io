/**---------------------------------------------------------------------------------------------------------------------
 * tgi.io/www.tgi.io/server.js
 *
 * First setup express server
 */
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('public'));
//app.use(serveIndex('public', {icons: true}));
app.use(serveStatic('source'));
//app.use(serveIndex('source', {icons: true}));
app.use(errorHandler({dumpExceptions: true, showStack: true}));

/**
 * Get our IP
 */
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
var k, k2;
for (k in interfaces) {
  for (k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family == 'IPv4' && !address.internal) {
      addresses.push(address.address)
    }
  }
}

/**
 * Start Server
 */
var IP = addresses[0];
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var hostname = process.env.OPENSHIFT_NODEJS_IP || IP;
var server = app.listen(port, hostname, function () {
  console.log('server listening on: http://' + hostname + ':' + port);
});

/**
 * tgi lib
 */
var TGI = require('tgi-store-remote/dist/tgi-store-host.js');
var tgi = TGI.CORE();
tgi.Transport.hostStore = new tgi.MemoryStore();

/**
 * Start up socket server (io)
 */
var io = require('socket.io').listen(server);
io.on('connection', function (socket) {
  console.log('socket.io connection: ' + socket.id);
  socket.on('ackmessage', tgi.Transport.hostMessageProcess);
  socket.on('message', inbound);
  socket.on('disconnect', function (reason) {
    console.log('message socket.io disconnect: ' + reason);
  });
  socket.send('wassup');
});

/**
 * App specific messages
 */
function inbound(msg) {
  console.log('inbound: ' + msg);
}

/**
 * All Done
 */
console.log('server initialized ' + new Date());