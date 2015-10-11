/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/start.js
 *
 * Final script starts app
 */
nav.set('contents', navContents);
app.start(function (request) {
  app.info('app got ' + request);
});