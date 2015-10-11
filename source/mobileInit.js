/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/main.js
 *
 * Initial script for app
 */
var tgi = TGI.CORE();
var bs = new (TGI.INTERFACE.FRAMEWORK7().Framework7Interface)({vendor: Framework7});
var app = new tgi.Application({interface: bs});
var nav = new tgi.Presentation();
var navContents = [];
app.setInterface(bs);
app.set('brand', 'tgi.io');
app.setPresentation(nav);
