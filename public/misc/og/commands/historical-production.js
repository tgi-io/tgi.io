/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/historical-production.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'historical',
    type: 'Presentation',
    icon: 'fa-line-chart',
    theme: 'default',
    contents: presentation
  }));
}());