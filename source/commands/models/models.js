/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/models/models.js
 */

(function () {
  var modelsCommand = new tgi.Command({
    name: 'models',
    type: 'Menu',
    contents: site.modelsMenu
  });
  site.navContents.push(modelsCommand);
}());