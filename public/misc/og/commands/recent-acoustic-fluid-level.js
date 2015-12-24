/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/recent-acoustic-fluid-level.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'acoustic level',
    type: 'Presentation',
    icon: 'fa-dashboard',
    theme: 'default',
    contents: presentation
  }));
}());