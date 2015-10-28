/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/login.js
 */

(function () {
  var loginPresentation = new tgi.Presentation();
  var storePicks = ['MemoryStore', 'LocalStore', 'HostStore'];
  var login, password;
  loginPresentation.set('contents', [
    '>',
    '**Please login**',
    '-',
    login = new tgi.Attribute({
      name: 'login',
      label: 'Login',
      type: 'String(20)',
      validationRule: {required: true},
      value: 'admin'
    }),
    password = new tgi.Attribute({
      name: 'password',
      label: 'Password',
      type: 'String(20)',
      validationRule: {required: true},
      hint: {password: true},
      value: 'tgi'
    }),
    //new tgi.Attribute({name: 'store', label: 'Store', type: 'String', quickPick: storePicks, value: '(memory store)'}),
    '>',
    new tgi.Command({name: 'Login', type: 'Function', theme: 'info', icon: 'fa-sign-in', contents: loginSession})
  ]);

  var loginCommand = new tgi.Command({
    name: 'login',
    type: 'Presentation',
    //theme: 'info',
    icon: 'fa-sign-in',
    presentationMode: 'Edit',
    contents: loginPresentation
  });

  site.navContents.push('-'); // Right justify if interface supports
  site.navContents.push(loginCommand);

  /**
   * After start, force login
   */
  //setTimeout(function () {
  //  loginCommand.execute(ui);
  //}, 0);

  /**
   * Start session when info submitted
   */
  function loginSession() {
    tgi.Transport.showLog=false;
    try {
      loginPresentation.validate(function () {
        if (loginPresentation.validationMessage) {
          app.info(loginPresentation.validationMessage != 'contents has validation errors' ? loginPresentation.validationMessage : 'login and password required');
          return;
        }
        site.session.startSession(site.hostStore, login.value, password.value, '*', function (err, session) {
          if (err)
            app.err('' + err);
          else
            app.info('it worked');
        });

      });
    } catch (e) {
      console.log('err ' + e);
    }
  }
}());
