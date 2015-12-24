/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/well-data.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'well data',
    type: 'Presentation',
    icon: 'fa-list-alt',
    theme: 'default',
    contents: presentation
  }));
}());