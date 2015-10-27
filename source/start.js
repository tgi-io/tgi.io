/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/start.js
 *
 * Final script starts app
 */



(function () {
  var RemoteStore = TGI.STORE.REMOTE().RemoteStore;
  site.hostStore = new RemoteStore({name: 'Host Test Store'});
  var hostAddress = '';
  site.hostStore.onConnect(hostAddress, function (store, err) {
    if (err) {
      console.log('hostStore unavailable (' + err + ')');
    } else {
      console.log('hostStore connected');
    }
    console.log(site.hostStore.name + ' ' + site.hostStore.storeType);
  }, {vendor: null, keepConnection: true});

  site.nav.set('contents', site.navContents);
  app.start(function (request) {
    app.info('app got ' + request);
  });
}());