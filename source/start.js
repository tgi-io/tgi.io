/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/start.js
 *
 * Final script starts app
 */


var RemoteStore = TGI.STORE.REMOTE().RemoteStore;
var hostStore = new RemoteStore({name: 'Host Test Store'});
// var hostAddress = 'http://localhost:8080';
var hostAddress = '';
hostStore.onConnect(hostAddress, function (store, err) {
  if (err) {
    console.log('hostStore unavailable (' + err + ')');
  } else {
    console.log('hostStore connected');

    var Stooge = function (args) {
      tgi.Model.call(this, args);
      this.modelType = "_tempTest_Stooge";
      this.attributes.push(new tgi.Attribute('name'));
    };
    Stooge.prototype = tgi.inheritPrototype(tgi.Model.prototype);
    var moe = new Stooge();
    moe.set('name', 'Moe');
    store.putModel(moe, function (model, error) {
      if (typeof error != 'undefined') {
        console.log('moe error ' + error);
      } else {
        console.log('moe cool ');
      }
    });
  }
  console.log(hostStore.name + ' ' + hostStore.storeType);
}, {vendor: null, keepConnection: true});

nav.set('contents', navContents);
app.start(function (request) {
  app.info('app got ' + request);
});