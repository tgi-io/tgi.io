/**---------------------------------------------------------------------------------------------------------------------
 * tgi.io/www.tgi.io/node-app.js
 */

// Initialize connect
var connect = require('connect');
var app = connect();
app.use(connect.static('public'));
app.use(connect.directory('public', {icons: true}));

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

// Start up HTTP server (http)
var IP = addresses[0];
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var hostname = process.env.OPENSHIFT_NODEJS_IP || IP;
var http = require('http').createServer(app);
var server = http.listen(port, hostname, function () {
  console.log('server listening on: http://' + hostname + ':' + port);
});

// Start up Socket Server (io)
var Connections = []; // Array of connections
var io = require('socket.io').listen(server);

// tgi lib
var TGI = require('tgi-store-remote/dist/tgi-store-host.js');
var tgi = TGI.CORE();
tgi.Transport.hostStore = new tgi.MemoryStore();

//var zsock;
io.on('connection', function (socket) {
  console.log('socket.io connection: ' + socket.id);
  socket.on('ackmessage', tgi.Transport.hostMessageProcess);
  socket.on('message', inbound);
  socket.on('disconnect', function (reason) {
    //zsock = null;
    console.log('message socket.io disconnect: ' + reason);
  });
  //zsock = socket;
  socket.send('wassup');
});

function inbound(msg) {
  console.log('inbound: ' + msg);
}

///**
// * Now tcp server for external access
// */
//var net = require('net');
//var tcpServer = net.createServer(function (socket) {
//  socket.setEncoding("utf8");
//  /**
//   * Connection Event triggered
//   */
//  var helloMessage = 'Hello ' + socket.remoteAddress;
//  console.log(helloMessage);
//  socket.write(helloMessage);
//  /**
//   * Data Handler
//   */
//  socket.on('data', function (buffer) {
//    if (buffer == 'k') { // Keep alive
//      socket.write('k');
//      return;
//    }
//    if (zsock) {
//      zsock.send(buffer);
//      console.log('tcpServer data (SENT): ' + buffer);
//    } else {
//      console.warn('tcpServer data (LOST): ' + buffer);
//    }
//  });
//  /**
//   * Error Handler
//   */
//  socket.on('error', function (stream) {
//    console.log('tcpServer: ' + stream);
//  });
//});
//tcpServer.listen(8081, IP);
