/**---------------------------------------------------------------------------------------------------------------------
 * www.tgi.io/source/commands/video.js
 */
(function () {
  var videoCommand = new tgi.Command({
    name: 'video',
    type: 'Function',
    icon: 'fa-file-video-o',
    theme: 'default',
    contents: function(){
      window.location = "misc/og/commands/video.mp4";
    }
  });
  site.navContents.push(videoCommand);
}());