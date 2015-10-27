/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/tools/create-data-set.js
 */

(function () {

  // System model
  var SysInfo = function (args) {
    tgi.Model.call(this, args);
    this.modelType = "SysInfo";
    this.attributes.push(new tgi.Attribute({name: 'dataRevision', type: 'Number'}));
  };
  SysInfo.prototype = Object.create(tgi.Model.prototype);

  var user;
  var createDataSetCommand = new tgi.Command({
    name: 'create dataset', type: 'Procedure', contents: new tgi.Procedure({
      tasks: [
        /**
         * Make sure database does not exist
         */
          function () {
          var task = this;
          try {
            var sysInfoList = new tgi.List(new SysInfo());
            site.hostStore.getList(sysInfoList, {}, {shit: 1}, function (model, error) {
              if (typeof error != 'undefined') {
                app.info('error getting list' + error);
                task.abort();
              } else {
                if (sysInfoList.length() > 0) {
                  app.info('database already exists');
                  task.abort();
                } else {
                  task.complete();
                }
              }
            });
          } catch (e) {
            app.info('error getting list' + e);
          }
        },
        /**
         * Create SysInfo
         */
          function () {
          var task = this;
          try {
            sysInfo = new SysInfo();
            sysInfo.set('dataRevision', 1);
            site.hostStore.putModel(sysInfo, function (model, error) {
              if (typeof error != 'undefined') {
                app.info('error creating sysInfo' + error);
                task.abort();
              } else {
                task.complete();
              }
            });
          } catch (e) {
            app.info('error creating SysInfo' + e);
          }
        },
        /**
         * Create admin
         */
          function () {
          var task = this;
          try {
            user = new tgi.User();
            user.set('name', 'admin');
            user.set('active', true);
            user.set('password', 'tgi');
            user.set('firstName', 'System');
            user.set('lastName', 'Administrator');
            site.hostStore.putModel(user, function (model, error) {
              if (typeof error != 'undefined') {
                app.info('error creating admin' + error);
                task.abort();
              } else {
                task.complete();
              }
            });
          } catch (e) {
            app.info('error creating admin' + e);
          }
        },
        function () {
          this.complete();
        },
        function () {
          this.complete();
        }
      ]
    })
  });
  createDataSetCommand.onEvent('Completed', function (event) {
    if (this.status == 1)
      app.info('Dataset created successfully.')
    else
      app.info('Dataset procedure failed.')
  });
  site.toolsMenu.push(createDataSetCommand);
}());
