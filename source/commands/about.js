/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/about.js
 */
(function () {
  var blah = 'blah ';
  blah += blah;
  blah += blah;
  blah += blah;
  blah += blah;
  blah += blah;
  blah += blah;
  blah += blah;
  blah += blah;


  var aboutPresentation = new tgi.Presentation();
  aboutPresentation.set('contents', [
    '# About tgi.io',
    '-',
    blah
  ]);
  var aboutCommand = new tgi.Command({
    name: 'about',
    type: 'Presentation',
    contents: aboutPresentation
  });

  navContents.push(aboutCommand);


}());