
function changeStartScreenImage(file) {
  var cmd = new UpdateStartScreenImageCommand();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.setParameter("image", file);
  cmd.execute();
}

var imageSelector = new ImageSelector(changeStartScreenImage);

$(document).ready(function() {
    $("#changeStartscreenButton").click(function() {
        imageSelector.show();
    });
});


