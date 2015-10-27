/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/main.js
 *
 * Initial script for app
 */

/**
 * app is tgi app instance - site is this applications namespace
 */
var app = new tgi.Application({interface: ui});
var site = {};

site.nav = new tgi.Presentation();
site.navContents = [];
site.toolsMenu = [];

/**
 * Core models for user and session
 */
site.user = new tgi.User();
site.session = new tgi.Session();


/**
 * get app interface ready
 */
app.setInterface(ui);
app.set('brand', 'tgi.io');
app.setPresentation(site.nav);
