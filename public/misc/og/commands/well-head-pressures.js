/**---------------------------------------------------------------------------------------------------------------------
 * well-head-pressures.js
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/well-head-pressures.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'pressures',
    name: 'pressures',
    type: 'Presentation',
    icon: 'fa-dashboard',
    theme: 'default',
    contents: presentation
  }));
}());