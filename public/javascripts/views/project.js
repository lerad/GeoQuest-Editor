/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
  function deployGame() {

    var my_url = "/projects/" + project_id + "/deploy";
    $.ajax({
     url: my_url,
     success: function() {
       $("#messageField").addClass("success");
       $("#messageField").removeClass("failure");
       $("#messageField").text("Deployment was successful");
     },
     error: function() {
       $("#messageField").addClass("failure");
       $("#messageField").removeClass("success");
       $("#messageField").text("Deployment failed");
     }
   });

  }

  $(document).ready(function() {
     $("#editName").editable(onNameChange, {});
  });

  function onNameChange(value, settings) {
      cmd = new ChangeProjectNameCommand();
      cmd.setParameter("project_id", project_id);
      cmd.setParameter("name", value);
      cmd.execute();
      return value;
  }