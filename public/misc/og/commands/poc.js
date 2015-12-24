/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/poc.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'POC',
    type: 'Presentation',
    icon: 'fa-file-image-o',
    theme: 'default',
    contents: presentation
  }));
}());