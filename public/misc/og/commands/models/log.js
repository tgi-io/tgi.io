/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/models/log.js
 */

(function () {
  var logPresentation = new tgi.Presentation();
  var logMaintenance = new site.ModelMaintenance(tgi.Log);
  logPresentation.preRenderCallback = function (command, callback) {
    logMaintenance.preRenderCallback(command, callback);
  };
  var logCommand = new tgi.Command({
    name: 'Log',
    theme: 'default',
    type: 'Presentation',
    icon: 'fa-list-alt',
    contents: logPresentation
  });
  site.modelsMenu.push(logCommand);

}());