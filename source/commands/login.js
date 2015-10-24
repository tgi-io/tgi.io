/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/login.js
 */

(function () {
  var loginPresentation = new tgi.Presentation();
  var storePicks = ['MemoryStore', 'LocalStore', 'HostStore'];
  loginPresentation.set('contents', [
    'Please login to see the fun stuff.',
    '-',
    new tgi.Attribute({name: 'login', label: 'Login', type: 'String(20)', hint: {required: true}, value: ''}),
    new tgi.Attribute({name: 'password', label: 'Password', type: 'String(20)', hint: {password: true}, value: ''}),
    new tgi.Attribute({name: 'store', label: 'Store', type: 'String', quickPick: storePicks, value: '(memory store)'}),
    '-',
    new tgi.Command({
      name: 'Login', type: 'Function', theme: 'info', icon: 'fa-sign-in', contents: function () {
        loginPresentation.validate(function () {

          if (loginPresentation.validationMessage) {
            app.info('error: ' + loginPresentation.validationMessage);
          } else {
            app.info('no error');
            // $("#panel1").show(); // todo don't hard code ?
            // app.setAppPresentation(privateMenu);
          }
        });
      }
    })
  ]);
  var loginCommand = new tgi.Command({
    name: 'login',
    type: 'Presentation',
    //theme: 'info',
    icon: 'fa-sign-in',
    presentationMode: 'Edit',
    contents: loginPresentation
  });
  navContents.push('-'); // Right justify if interface supports
  navContents.push(loginCommand);
}());