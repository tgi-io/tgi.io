/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/saltwater-tank-levels.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'tank levels',
    type: 'Presentation',
    icon: 'fa-dashboard',
    theme: 'default',
    contents: presentation
  }));
}());