/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/tools/tools.js
 */

(function () {
  console.log('fuck');
  var toolsCommand = new tgi.Command({
    name: 'tools',
    type: 'Menu',
    contents: site.toolsMenu
  });
  site.navContents.push(toolsCommand);
  console.log('foozle');
}());