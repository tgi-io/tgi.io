/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-bootstrap/lib/tgi-interface-bootstrap.lib.js
 */
TGI.INTERFACE = TGI.INTERFACE || {};
TGI.INTERFACE.BOOTSTRAP = function () {
  return {
    version: '0.0.2',
    BootstrapInterface: BootstrapInterface
  };
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-bootstrap/lib/tgi-interface-bootstrap.source.js
 */
/**
 * Constructor
 */
var BootstrapInterface = function (args) {
  if (false === (this instanceof Interface)) throw new Error('new operator required');
  args = args || {};
  args.name = args.name || '(unnamed)';
  args.description = args.description || 'a BootstrapInterface';
  args.vendor = args.vendor || null;
  var i;
  var unusedProperties = getInvalidProperties(args, ['name', 'description', 'vendor']);
  var errorList = [];
  for (i = 0; i < unusedProperties.length; i++) errorList.push('invalid property: ' + unusedProperties[i]);
  if (errorList.length > 1)
    throw new Error('error creating Interface: multiple errors');
  if (errorList.length) throw new Error('error creating Interface: ' + errorList[0]);
  // default state
  this.startcallback = null;
  this.stopcallback = null;
  this.mocks = [];
  this.mockPending = false;
  this.doc = {}; // Keep DOM element IDs here
  // args ok, now copy to object
  for (i in args) this[i] = args[i];
};
BootstrapInterface.prototype = Object.create(Interface.prototype);
/**
 * Methods
 */
BootstrapInterface.prototype.canMock = function () {
  return this.vendor ? true : false;
};
BootstrapInterface.prototype.start = function (application, presentation, callback) {
  if (!(application instanceof Application)) throw new Error('Application required');
  if (!(presentation instanceof Presentation)) throw new Error('presentation required');
  if (typeof callback != 'function') throw new Error('callback required');
  this.application = application;
  this.presentation = presentation;
  this.startcallback = callback;
  if (!this.vendor) throw new Error('Error initializing Bootstrap');
  try {
    if (!BootstrapInterface._bs) {
      BootstrapInterface._bs = new this.vendor();
    }
  } catch (e) {
    throw new Error('Error initializing Bootstrap: ' + e);
  }
  /**
   * Add needed html to DOM
   */
  this.htmlPanels();
  this.htmlDialog();
  if (this.presentation.get('contents').length)
    this.htmlNavigation();
};
BootstrapInterface.prototype.dispatch = function (request, response) {
  if (false === (request instanceof Request)) throw new Error('Request required');
  if (response && typeof response != 'function') throw new Error('response callback is not a function');
  var requestHandled = false;
  try {
    if (this.application) {
      if (request.type == 'Command' && request.command.type == 'Presentation') {
        this.activatePanel(request.command);
        requestHandled = true;
      } else {
        requestHandled = !this.application.dispatch(request);
      }
    }
    if (!requestHandled && this.startcallback) {
      this.startcallback(request);
    }
  } catch (e) {
    if (this.startcallback) {
      this.startcallback(e);
    }
  }
};
/**
 * DOM helper
 */
BootstrapInterface.addEle = function (parent, tagName, className, attributes) {
  var ele = document.createElement(tagName);
  if (className && className.length)
    ele.className = className;
  if (attributes)
    for (var i in attributes)
      if (attributes.hasOwnProperty(i)) ele.setAttribute(i, attributes[i]);

  parent.appendChild(ele);
  return ele;
};
BootstrapInterface.addTopEle = function (parent, tagName, className, attributes) {
  var ele = document.createElement(tagName);
  if (className && className.length)
    ele.className = className;
  if (attributes)
    for (var i in attributes)
      if (attributes.hasOwnProperty(i)) ele.setAttribute(i, attributes[i]);
  if (parent.firstChild)
    parent.insertBefore(ele, parent.firstChild);
  else
    parent.appendChild(ele);
  return ele;
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-bootstrap/lib/tgi-interface-bootstrap-navigation.source.js
 */
BootstrapInterface.prototype.htmlNavigation = function () {
  var addEle = BootstrapInterface.addEle;
  this.doc.navBar = addEle(document.body, 'nav', 'navbar navbar-default navbar-fixed-top');
  var navBarContainer = addEle(this.doc.navBar, 'div', 'container');
  this.doc.navBarHeader = addEle(navBarContainer, 'div', 'navbar-header');
  var navBarHeaderButton = addEle(this.doc.navBarHeader, 'button', 'navbar-toggle collapsed', {
    'data-toggle': 'collapse',
    'data-target': '#navbar',
    'aria-expanded': 'false',
    'aria-controls': 'navbar'
  });
  addEle(navBarHeaderButton, 'span', 'icon-bar');
  addEle(navBarHeaderButton, 'span', 'icon-bar');
  addEle(navBarHeaderButton, 'span', 'icon-bar');
  this.doc.navBarBody = addEle(navBarContainer, 'div', 'navbar-collapse collapse', {id: 'navbar'});
  this.doc.navBarAlert = addEle(navBarContainer, 'div', 'container', {style: "margin:0"})
  this.refreshNavigation();
};
BootstrapInterface.prototype.refreshNavigation = function () {
  this.doc.navBarBody.innerHTML = ''; // remove any child nodes
  var addEle = BootstrapInterface.addEle;
  this.doc.navBarLeft = addEle(this.doc.navBarBody, 'ul', 'nav navbar-nav');
  this.doc.navBarRight = addEle(this.doc.navBarBody, 'ul', 'nav navbar-nav navbar-right');
  /**
   * Brand
   */
  addEle(this.doc.navBarHeader, 'a', 'navbar-brand').innerHTML = '<a href="#">' + this.application.get('brand') + '</a>';
  /**
   * Menu
   */
  var menuContents = this.presentation.get('contents');
  var separatorSeen = false;
  for (var menuItem in menuContents) if (menuContents.hasOwnProperty(menuItem)) {
    if (menuContents[menuItem].type == 'Menu') {
      var parentMenu = this.addNavBarListMenu(this.doc.navBarLeft, menuContents[menuItem].name);
      var subMenu = menuContents[menuItem].contents;
      for (var subPres in subMenu)
        if (subMenu.hasOwnProperty(subPres))
          this.addNavBarListItem(parentMenu, subMenu[subPres]);
    } else {
      if (menuContents[menuItem] == '-')
        separatorSeen = true;
      else
        this.addNavigationItem((separatorSeen ? this.doc.navBarRight : this.doc.navBarLeft), menuContents[menuItem]);
    }
  }
};
BootstrapInterface.prototype.addNavigationItem = function (parent, action) {
  var bootstrapInterface = this;
  var listItem = BootstrapInterface.addEle(parent, 'li');
  var icon = '';
  var theme = action.theme || 'default';
  if (action.icon) {
    if (left(action.icon,2) == 'fa')
      icon = '<i class="fa ' + action.icon + '"></i>&nbsp;';
    else
      icon = '<span class="glyphicon ' + action.icon + '"></span>&nbsp;';
    //<a href="#"><span class="glyphicon glyphicon-chevron-down panel-glyph-left text-muted"></span></a>
  }
  //listItem.innerHTML = '<a >' + icon + action.name + '</a>';
  listItem.innerHTML = '<button type="button" class="btn btn-' + theme + ' navbar-btn">' + icon + action.name + '</button>';
  $(listItem).click(function (e) {
    bootstrapInterface.dispatch(new Request({type: 'Command', command: action}));
    e.preventDefault();
  });
};
BootstrapInterface.prototype.addNavBarListItem = function (parent, action, icon) {
  var self = this;
  var html;
  var listItem = document.createElement('li');
  icon = icon || '';
  if (action instanceof Command) {
    html = '<a>' + icon + action.name + '</a>';
    $(listItem).click(function (e) {
      self.dispatch(new Request({type: 'Command', command: action}));
      e.preventDefault();
    });
  } else {
    if (action == '-') {
      listItem.className = 'divider';
    } else {
      listItem.className = 'dropdown-header';
      html = action;
    }
  }
  listItem.innerHTML = html;
  parent.appendChild(listItem);
};
BootstrapInterface.prototype.addNavBarListMenu = function (parent, name) {

  var dropDown = document.createElement('li');
  dropDown.className = "dropdown";
  //dropDown.innerHTML = '<a href="#" class="dropdown-toggle navbar-menu" data-toggle="dropdown">' + name + '<b class="caret"></b></a>';
  dropDown.innerHTML = '<button type="button" class="dropdown-toggle btn btn-default navbar-btn" data-toggle="dropdown">' + name + '&nbsp;<b class="caret"></b></button>';
  // listItem.innerHTML = '<button type="button" class="btn btn-default navbar-btn">' + action.name + '</button>';
  parent.appendChild(dropDown);

  var dropDownMenu = document.createElement('ul');
  dropDownMenu.className = "dropdown-menu";
  dropDown.appendChild(dropDownMenu);

  return dropDownMenu;
};
/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-bootstrap/lib/tgi-interface-bootstrap-panels.source.js
 */

/**
 * Called at startup for initial html
 */
BootstrapInterface.prototype.htmlPanels = function () {
  var bootstrapInterface = this;
  var addEle = BootstrapInterface.addEle;

  /**
   * Main container and row for panels
   */
  this.doc.mainContainer = addEle(document.body, 'div', 'container main-container', {role: 'main'});
  this.doc.panelRow = addEle(this.doc.mainContainer, 'div', 'row');
};

/**
 * activatePanel will create if needed, make panel visible and render contents
 */
BootstrapInterface.prototype.activatePanel = function (command) {
  var bootstrapInterface = this;
  var addEle = BootstrapInterface.addEle;
  var addTopEle = BootstrapInterface.addTopEle;
  var presentation = command.contents;
  var name = presentation.get('name') || command.name;
  var theme = command.theme || 'default';
  var icon = command.icon;
  if (icon) {
    if (left(icon, 2) == 'fa')
      icon = '<i class="fa ' + icon + '"></i>&nbsp;';
    else
      icon = '<span class="glyphicon ' + icon + '"></span>&nbsp;';
  }
  var title = icon ? icon + name : name;

  /**
   * this.panels array of panels
   */
  if (typeof this.panels == 'undefined')
    this.panels = [];

  /**
   * See if command already has a panel
   */
  var panel;
  for (var i = 0; (typeof panel == 'undefined') && i < this.panels.length; i++) {
    if (name == this.panels[i].name)
      panel = this.panels[i];
  }

  /**
   * If we did not find panel create
   */
  if (typeof panel == 'undefined') {
    panel = {
      name: name,
      listeners: []
    };
    this.panels.push(panel);

    /**
     * Main framing and title text
     */
    panel.panelDiv = addTopEle(this.doc.panelRow, 'div', 'panel panel-' + theme, {draggable: 'true'});
    panel.panelHeading = addEle(panel.panelDiv, 'div', 'panel-heading');
    panel.panelTitle = addEle(panel.panelHeading, 'div', 'panel-title');
    panel.panelTitleText = addEle(panel.panelTitle, 'a', 'panel-title-text', {href: '#'});
    panel.panelTitleText.innerHTML = title;

    /**
     * Close Panel Button
     */
    panel.panelClose = addEle(panel.panelTitle, 'a', undefined, {href: '#'});
    panel.panelClose.innerHTML = '<span class="glyphicon glyphicon-remove panel-glyph-right pull-right text-muted"></span>';
    $(panel.panelClose).click(function (e) {
      $(panel.panelClose).off(); // kill listener
      for (var i = 0; i < bootstrapInterface.panels.length; i++) {
        if (panel == bootstrapInterface.panels[i])
          bootstrapInterface.panels.splice(i, 1);
      }
      bootstrapInterface.doc.panelRow.removeChild(panel.panelDiv);
      panel = undefined; // delete dom refs
      e.preventDefault();
    });

    /**
     * Hide Panel Button
     */
    panel.panelHide = addEle(panel.panelTitle, 'a', undefined, {href: '#'});
    panel.panelHide.innerHTML = '<span class="glyphicon glyphicon-chevron-down panel-glyph-right pull-right text-muted"></span>';
    $(panel.panelHide).click(function (e) {
      $(panel.panelBody).hide('fast');
      $(panel.panelHide).hide();
      $(panel.panelShow).show();
      e.preventDefault();
    });

    /**
     * Show Panel Button
     */
    panel.panelShow = addEle(panel.panelTitle, 'a', undefined, {href: '#'});
    panel.panelShow.innerHTML = '<span class="glyphicon glyphicon-chevron-left panel-glyph-right pull-right text-muted"></span>';
    $(panel.panelShow).hide();
    $(panel.panelShow).click(function (e) {
      $(panel.panelBody).show('fast');
      $(panel.panelHide).show();
      $(panel.panelShow).hide();
      e.preventDefault();
    });

    panel.panelBody = addEle(panel.panelDiv, 'div', 'panel-body bg-' + theme);
    panel.panelWell = addEle(panel.panelBody, 'div', 'well-panel');
    panel.panelForm = addEle(panel.panelWell, 'form', 'form-horizontal');

  }

  /**
   * Remove listeners before deleting -- todo WTF ?
   */
  for (i = 0; i < panel.listeners.length; i++) {
    var ele = panel.listeners[i];
    $(ele).off();
  }
  panel.buttonDiv = undefined; // WTF ends HERE!!!!!!!!!!!

  /**
   * Render panel body based on presentation mode
   */
  switch (command.presentationMode) {
    case 'View': // todo edit/view wacked (says view renders edit ???)
      bootstrapInterface.renderPanelBodyView(panel, command);
      $(panel.panelBody).show('fast'); //
      $(panel.panelHide).show();
      $(panel.panelShow).hide();
      $('html, body').animate({
        scrollTop: $(panel.panelDiv).offset().top - $(bootstrapInterface.doc.navBar).height() - 8
      }, 250);
      break;
    default:
      bootstrapInterface.info('unknown command.presentationMode: ' + command.presentationMode);
  }
};

/**
 * renderPanelBodyView will insert the html into the body of the panel for View presentation mode
 */
BootstrapInterface.prototype.renderPanelBodyView = function (panel, command) {
  var bootstrapInterface = this;
  var addEle = BootstrapInterface.addEle;
  var i;
  var contents = command.contents.get('contents');
  panel.panelForm.innerHTML = '';
  for (i = 0; i < contents.length; i++) {
    // String markdown or separator '-'
    if (typeof contents[i] == 'string') {
      if (contents[i] == '-') {
        panel.panelForm.appendChild(document.createElement("hr"));
      } else {
        var txtDiv = document.createElement("div");
        txtDiv.innerHTML = marked(contents[i]);
        panel.panelForm.appendChild(txtDiv);
      }
    }
    if (contents[i] instanceof Attribute) renderAttribute(contents[i]);
    if (contents[i] instanceof Command) renderCommand(contents[i]);
  }
  /**
   * function to render Attribute
   */
  function renderAttribute(attribute) {

    var daList;
    var daItems;
    var formGroup;
    var label;
    var inputDiv;
    var input;
    var helpTextDiv;
    var sz;
    var button;
    var select;
    var textNode;
    var inputGroupDiv;
    var inputGroupSpan;
    var inputGroupButton;
    var inputGroupDropDownMenu;
    var initSwitchery;
    var items;
    var j;


    /**
     * Create formGroup container and label
     */

    formGroup = addEle(panel.panelForm, 'div', 'form-group');
    addEle(formGroup, 'label', 'col-sm-3 control-label').innerHTML = attribute.label;

    /**
     * Create inputDiv - set with of input based on size of field
     */
    sz = '1';
    if (attribute.size > 2) sz = '2';
    if (attribute.size > 5) sz = '3';
    if (attribute.size > 10) sz = '4';
    if (attribute.size > 20) sz = '5';
    if (attribute.size > 25) sz = '6';
    if (attribute.size > 30) sz = '7';
    if (attribute.size > 40) sz = '8';
    if (attribute.size > 50) sz = '9';
    if (attribute.type == 'Number') sz = '3';
    if (attribute.type == 'Date') sz = '3';
    if (attribute.type == 'Boolean') sz = '3';
    inputDiv = addEle(formGroup, 'div', 'col-sm-' + sz);

    /**
     * Render based on type
     */
    switch (attribute.type) {
      case 'Boolean':
        input = addEle(inputDiv, 'input', 'js-switch');
        input.setAttribute("type", "checkbox");
        if (attribute.value)
          input.setAttribute("checked", "true");
        initSwitchery = new Switchery(input, // todo events inside switchery may cause leakage when panels closed
          {
            color: window.getComputedStyle(panel.panelTitle, null).getPropertyValue('color'),
            secondaryColor: '#dfdfdf',
            className: 'switchery',
            disabled: false,
            disabledOpacity: 0.5,
            speed: '0.1s'
          });
        break;

      case 'Date':
        inputGroupDiv = addEle(inputDiv, 'div', 'input-group date');

        input = addEle(inputGroupDiv, 'input', 'form-control');
        if (attribute.placeHolder)
          input.setAttribute("placeHolder", attribute.placeHolder);
        input.setAttribute("type", "Date");
        input.setAttribute("maxlength", attribute.size);
        if (attribute.value)
          input.value = (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear();

        inputGroupSpan = addEle(inputGroupDiv, 'span', 'input-group-addon');
        inputGroupSpan.innerHTML = '<i class="fa fa-calendar"></i>';
        $(inputGroupDiv).datepicker({autoclose: true, todayBtn: true, todayHighlight: true, showOnFocus: false});
        panel.listeners.push(inputGroupDiv); // so we can avoid leakage on deleting panel
        break;

      case 'Number':
        input = addEle(inputDiv, 'input', 'form-control');
        if (attribute.placeHolder)
          input.setAttribute("placeHolder", attribute.placeHolder);
        input.setAttribute("type", "number");
        input.setAttribute("maxlength", attribute.size);
        if (attribute.value)
          input.setAttribute("value", attribute.value);
        break;

      default: // String
        if (attribute.quickPick) {
          inputGroupDiv = addEle(inputDiv, 'div', 'input-group');
          input = addEle(inputGroupDiv, 'input', 'form-control');
        } else {
          input = addEle(inputDiv, 'input', 'form-control');
        }
        if (attribute.placeHolder)
          input.setAttribute("placeHolder", attribute.placeHolder);
        input.setAttribute("type", attribute.hint.password ? "password" : "text");
        input.setAttribute("maxlength", attribute.size);
        if (attribute.value)
          input.setAttribute("value", attribute.value);
        if (attribute.quickPick) {

          inputGroupSpan = addEle(inputGroupDiv, 'span', 'input-group-btn');

          inputGroupButton = addEle(inputGroupSpan, 'button', 'btn btn-default dropdown-toggle');
          inputGroupButton.type = 'button';
          inputGroupButton.setAttribute('data-toggle', 'dropdown');
          inputGroupButton.innerHTML = '<span class="caret"></span>';


          daItems = attribute.quickPick;
          daList = '';
          for (j = 0; j < daItems.length; j++) {
            daList += '<li><a href="#">' + daItems[j] + '</a></li>';
          }

          inputGroupDropDownMenu = addEle(inputGroupSpan, 'ul', 'dropdown-menu pull-right');
          inputGroupDropDownMenu.innerHTML = daList;
          $(inputGroupDropDownMenu).click(function (e) {
            input.value = e.originalEvent.srcElement.innerText;
            e.preventDefault();
          });
          panel.listeners.push(inputGroupDropDownMenu); // so we can avoid leakage on deleting panel
        }
    }
  }

  /**
   * function to render Command
   */
  function renderCommand(command) {

    if (!panel.buttonDiv) {
      var formGroup = addEle(panel.panelForm, 'div', 'form-group');
      //panel.buttonDiv = addEle(formGroup, 'div', 'col-sm-offset-3 col-sm-9'); // after form
      panel.buttonDiv = addEle(formGroup, 'div', 'col-sm-9');
    }
    var cmdTheme = command.theme || 'default';
    var button = addEle(panel.buttonDiv, 'button', 'btn btn-' + cmdTheme + ' btn-presentation', {type: 'button'});

    var icon = command.icon;
    if (icon) {
      if (left(icon, 2) == 'fa')
        icon = '<i class="fa ' + icon + '"></i>&nbsp;';
      else
        icon = '<span class="glyphicon ' + icon + '"></span>&nbsp;';
      button.innerHTML = icon + command.name;
    } else {
      button.innerHTML = command.name;
    }

    $(button).on('click', function (event) {
      event.preventDefault();
      bootstrapInterface.dispatch(new Request({type: 'Command', command: command}));
    });
    panel.listeners.push(button); // so we can avoid leakage on deleting panel
  }
};

/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-bootstrap/lib/tgi-interface-bootstrap-queries.source.js
 */

/**
 * Called at startup for initial html
 */
BootstrapInterface.prototype.htmlDialog = function () {
  var bootstrapInterface = this;
  var addEle = BootstrapInterface.addEle;
  var modalDialog, modalContent, modalHeader, modalBody, modalFooter, modalOK, modalCancel, modalYes, modalNo, choice;

  /**
   * ok()
   */
  this.doc.okDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.okDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.okDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  this.doc.okDialogBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalOK = addEle(modalFooter, 'button', 'btn btn-primary');
  modalOK.innerHTML = '&nbsp;&nbsp;OK&nbsp;&nbsp;';
  $(modalOK).on('click', function () {
    $(bootstrapInterface.doc.okDialog).modal('hide');
  });
  $(this.doc.okDialog).on('hidden.bs.modal', function (e) {
    if (bootstrapInterface.okcallback) {
      var callback = bootstrapInterface.okcallback;
      delete bootstrapInterface.okcallback;
      callback();
    }
  });
  /**
   * yesno()
   */
  this.doc.yesnoDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.yesnoDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.yesnoDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  this.doc.yesnoDialogBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalYes = addEle(modalFooter, 'button', 'btn btn-success');
  modalYes.innerHTML = '&nbsp;<u>Y</u>es&nbsp;';
  $(modalYes).on('click', function () {
    $(bootstrapInterface.doc.yesnoDialog).modal('hide');
    bootstrapInterface.yesnoResponse = true;
  });
  modalNo = addEle(modalFooter, 'button', 'btn btn-danger');
  modalNo.innerHTML = '&nbsp;<u>N</u>o&nbsp;&nbsp;';
  $(modalNo).on('click', function () {
    $(bootstrapInterface.doc.yesnoDialog).modal('hide');
    bootstrapInterface.yesnoResponse = false;
  });
  $(this.doc.yesnoDialog).on('hidden.bs.modal', function (e) {
    if (bootstrapInterface.yesnocallback) {
      var callback = bootstrapInterface.yesnocallback;
      delete bootstrapInterface.yesnocallback;
      callback(bootstrapInterface.yesnoResponse);
    }
  });
  /**
   * ask()
   */
  this.doc.askDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.askDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.askDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  modalBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  this.doc.askDialogPrompt = addEle(modalBody, 'div', 'modal-body');
  this.doc.askDialogInput = addEle(modalBody, 'input', 'form-control', {style: 'margin:0 auto; width:80%;'});
  $(this.doc.askDialogInput).keypress(function (e) {
    if (e.which == 13) {
      bootstrapInterface.askResponse = bootstrapInterface.doc.askDialogInput.value;
      $(bootstrapInterface.doc.askDialog).modal('hide');
    }
  });
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalOK = addEle(modalFooter, 'button', 'btn btn-primary');
  modalOK.innerHTML = '&nbsp;&nbsp;OK&nbsp;&nbsp;';
  $(modalOK).on('click', function () {
    bootstrapInterface.askResponse = bootstrapInterface.doc.askDialogInput.value;
    $(bootstrapInterface.doc.askDialog).modal('hide');
  });
  modalCancel = addEle(modalFooter, 'button', 'btn btn-default');
  modalCancel.innerHTML = 'Cancel';
  $(modalCancel).on('click', function () {
    bootstrapInterface.askResponse = undefined;
    $(bootstrapInterface.doc.askDialog).modal('hide');
  });
  $(this.doc.askDialog).on('hidden.bs.modal', function (e) {
    if (bootstrapInterface.askcallback) {
      var callback = bootstrapInterface.askcallback;
      delete bootstrapInterface.askcallback;
      callback(bootstrapInterface.askResponse);
    }
  });
  $(this.doc.askDialog).on('shown.bs.modal', function (e) {
    $(bootstrapInterface.doc.askDialog).focus();
    $(bootstrapInterface.doc.askDialogInput).focus();
  });
  /**
   * choose()
   */
  this.doc.chooseDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.chooseDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.chooseDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  modalBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  this.doc.chooseDialogPrompt = addEle(modalBody, 'div', 'modal-body', {style: 'text-align: center'});
  this.doc.chooseDialogButtons = [];
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 0;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 1;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 2;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 3;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 4;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 5;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 6;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = 7;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalCancel = addEle(modalFooter, 'button', 'btn btn-default btn-block');
  modalCancel.innerHTML = '<b class="text-danger">Cancel</b>';
  $(modalCancel).on('click', function () {
    bootstrapInterface.doc.chooseDialogChoice = undefined;
    $(bootstrapInterface.doc.chooseDialog).modal('hide');
  });
  $(this.doc.chooseDialog).on('hidden.bs.modal', function (e) {
    if (bootstrapInterface.choosecallback) {
      var callback = bootstrapInterface.choosecallback;
      delete bootstrapInterface.choosecallback;
      callback(bootstrapInterface.doc.chooseDialogChoices[bootstrapInterface.doc.chooseDialogChoice]);
    }
  });
};

BootstrapInterface.prototype.info = function (text) {
  /*
   var bootstrapInterface = this;
   if (!text || typeof text !== 'string') throw new Error('text required');
   var infoClass = ' class="text-center text-info" ';
   var infoStyle = ' style="margin-top: 0; margin-bottom: 4px;" ';
   this.doc.navBarAlert.innerHTML = '<h5 ' + infoClass + infoStyle + '>' + text + '</h5>';
   $(this.doc.navBarAlert).click(function (e) {
   bootstrapInterface.doc.navBarAlert.innerHTML = '';
   e.preventDefault();
   });
   setTimeout(function () {
   bootstrapInterface.doc.navBarAlert.innerHTML = '';
   },3000);
   */
  var self = this;
  var notify = $.notify({
    // options
    icon: 'glyphicon glyphicon-info-sign',
    title: 'Information',
    message: text,
    url: 'https://github.com/mouse0270/bootstrap-notify',
    target: '_blank'
  }, {
    // settings
    element: 'body',
    position: null,
    type: "info",
    allow_dismiss: true,
    newest_on_top: true,
    placement: {
      from: "top",
      align: "right"
    },
    offset: {
      x: 20,
      y: self.doc.navBarHeader.offsetHeight+20
    },
    spacing: 10,
    z_index: 1031,
    delay: 0,
    timer: 1000,
    //url_target: '_blank',
    mouse_over: null,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    onShow: null,
    onShown: null,
    onClose: null,
    onClosed: null,
    icon_type: 'class',
    template: '<div data-notify="container" class="col-xs-11 col-sm-6 alert alert-notify alert-{0}" role="alert">' +
    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
    '<h4>' +
    '<span data-notify="icon"></span> ' +
    '<span data-notify="title">{1}</span>' +
    '</h4>' +
    '<span data-notify="message">{2}</span>' +
    '<div class="progress" data-notify="progressbar">' +
    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    '</div>' +
      //'<a href="{3}" target="{4}" data-notify="url"></a>' +
    '</div>'
  });

  setTimeout(function () {
    notify.close();
  }, 3000);


};
BootstrapInterface.prototype.ok = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.okPending) {
    delete this.okPending;
    callback();
  } else {
    this.doc.okDialogTitle.innerHTML = this.application ? this.application.get('brand') : '?';
    this.doc.okDialogBody.innerHTML = prompt;
    $(this.doc.okDialog).modal();
    this.okcallback = callback;
  }
};
BootstrapInterface.prototype.yesno = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.yesnoPending) {
    delete this.yesnoPending;
    callback(this.yesnoResponse);
  } else {
    this.doc.yesnoDialogTitle.innerHTML = this.application.get('brand');
    this.doc.yesnoDialogBody.innerHTML = prompt;
    $(this.doc.yesnoDialog).modal();
    this.yesnocallback = callback;
  }
};
BootstrapInterface.prototype.ask = function (prompt, attribute, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('attribute or callback expected');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.askPending) {
    delete this.askPending;
    callback(this.askResponse);
  } else {
    this.doc.askDialogTitle.innerHTML = this.application.get('brand');
    this.doc.askDialogPrompt.innerHTML = prompt + '<br><br>';
    $(this.doc.askDialog).modal();
    this.askcallback = callback;
  }
};
BootstrapInterface.prototype.choose = function (prompt, choices, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.choosePending) {
    delete this.choosePending;
    callback(Interface.firstMatch(this.chooseResponse, choices));
  } else {
    if (choices.length > this.doc.chooseDialogButtons.length) throw new Error('max choices reached in choose');
    this.doc.chooseDialogTitle.innerHTML = this.application.get('brand');
    this.doc.chooseDialogPrompt.innerHTML = prompt.replace(/\n/g, '<br>');
    $(this.doc.chooseDialog).modal();
    this.choosecallback = callback;
    this.doc.chooseDialogChoices = choices;
    for (var i = 0; i < this.doc.chooseDialogButtons.length; i++) {
      if (i < choices.length) {
        this.doc.chooseDialogButtons[i].innerHTML = '<b class="text-primary">' + choices[i] + '</b>';
        $(this.doc.chooseDialogButtons[i]).show();
      } else {
        $(this.doc.chooseDialogButtons[i]).hide();
      }
    }
  }
  /**
   * Since framework does not return any info in callback
   */
  function cbCancel() {
    callback();
  }

  function cb0() {
    callback(choices[0]);
  }

  function cb1() {
    callback(choices[1]);
  }

  function cb2() {
    callback(choices[2]);
  }

  function cb3() {
    callback(choices[3]);
  }

  function cb4() {
    callback(choices[4]);
  }

  function cb5() {
    callback(choices[5]);
  }

  function cb6() {
    callback(choices[6]);
  }

  function cb7() {
    callback(choices[7]);
  }

  function cb8() {
    callback(choices[8]);
  }

  function cb9() {
    callback(choices[9]);
  }
};
