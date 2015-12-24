/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/production-report.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'production report',
    type: 'Presentation',
    icon: 'fa-th-list',
    theme: 'default',
    contents: presentation
  }));
}());