/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/utility/model-maintenance.js
 */

var designToDo_ui = ui;

site.ModelMaintenance = function (ModelConstructor) {
  this.model = new ModelConstructor();
  this.viewState = 'LIST';
};

site.ModelMaintenance.prototype.preRenderCallback = function (command, callback) {
  var self = this;
  self.name = self.model.modelType.toLowerCase();
  self.presentation = command.contents;
  self.contents = [];
  /**
   * Prepare the presentation for rendering based on view state
   */
  console.log('self.viewState ' + self.viewState);
  switch (self.viewState) {
    case 'SEARCH':
      renderSearch();
      break;
    case 'LIST':
      renderList();
      break;
    case 'VIEW':
      renderView();
      break;
    case 'EDIT':
      renderEdit();
      break;
    default:
      self.contents.push('UNKNOWN VIEW STATE ' + self.viewState);
      callbackDone();
      break;
  }

  /**
   * Callback after async ops done
   */
  function callbackDone() {
    self.presentation.set('contents', self.contents);
    callback(command);
  }

  /**
   * VIEW STATE: Search
   */
  function renderSearch() {
    command.presentationMode = 'Edit';
    self.contents.push('Enter any search criteria to locate the ' + self.name + ' and click find or click new to add a ' + self.name + '.');
    self.contents.push('-');
    for (var i = 1; i < self.model.attributes.length; i++) { // copy all attribs except id
      self.contents.push(self.model.attributes[i]);
    }
    self.contents.push('-');
    self.contents.push(new tgi.Command({
        name: 'Find ' + self.model.modelType,
        theme: 'default',
        icon: 'fa-search',
        type: 'Function',
        contents: function () {
          for (var i = 1; i < self.model.attributes.length; i++) { // copy all attribs except id
            var attribute = self.model.attributes[i];
            console.log('<< ' + attribute.name + ': ' + attribute.value + ' >>');
          }
          self.viewState = 'LIST';
          command.execute(designToDo_ui);
        }
      }
    ));
    self.contents.push(new tgi.Command({
        name: 'New ' + self.model.modelType,
        theme: 'default',
        icon: 'fa-plus-square-o',
        type: 'Function',
        contents: function () {
          self.viewState = 'EDIT';
          command.execute(designToDo_ui);
        }
      }
    ));
    callbackDone();
  }

  /**
   * VIEW STATE: List
   */
  function renderList() {
    command.presentationMode = 'View';
    //self.contents.push('### list');
    try {
      var list = new tgi.List(self.model);
      list.pickKludge = function (id) {
        var items = list._items;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (id == item[0]) {
            if (item[8]) {
              window.open("invoices/" + item[7] + ".pdf", "_blank");
            } else {
              app.err('Scanned invoice unavailable.');
            }
          }
        }
      };

      //site.hostStore.getList(list, {name: /^X/i}, {}, function (list, error) {
      site.hostStore.getList(list, {}, {name:1}, function (list, error) {
        if (typeof error != 'undefined') {
          self.contents.push('#### ' + e);
          console.log('' + e);
          app.err('' + e);
        } else {
          self.contents.push(list);
        }
        callbackDone();
      });
    } catch (e) {
      console.log('' + e);
      app.err('' + e);
      callbackDone();
    }
  }

  /**
   * VIEW STATE: View
   */
  function renderView() {
    command.presentationMode = 'View';
    self.contents.push('### view');
    callbackDone();
  }

  /**
   * VIEW STATE: Edit
   */
  function renderEdit() {
    command.presentationMode = 'Edit';
    self.contents.push('### edit');
    callbackDone();
  }
};
