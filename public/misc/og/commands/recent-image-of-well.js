/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/xxx/well-data
 */
(function () {
  var presentation = new tgi.Presentation();
  presentation.preRenderCallback = function (command, callback) {
    site.loadPanel(command, 'misc/og/commands/recent-image-of-well.md', callback);
  };
  site.navContents.push(new tgi.Command({
    name: 'recent image',
    type: 'Presentation',
    icon: 'fa-file-image-o',
    theme: 'default',
    contents: presentation
  }));
}());