/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/about.js
 */
(function () {
  var aboutPresentation = new tgi.Presentation();
  var counter = new tgi.Attribute({name: 'Counter', type: 'Number', value: 100});
  aboutPresentation.set('contents', [
    '# About tgi.io',
    '-',
    'text to come ...',
    counter
  ]);
  var aboutCommand = new tgi.Command({
    name: 'about',
    type: 'Presentation',
    theme: 'info',
    icon: 'fa-info-circle',
    contents: aboutPresentation
  });

  navContents.push(aboutCommand);


}());