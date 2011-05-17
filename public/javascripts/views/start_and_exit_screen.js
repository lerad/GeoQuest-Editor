
  var selectedImage = "";

  $(document).ready(function() {
	var $dialog = $('<div></div>')
		.html('<div class="file-tree" id="fileTree"></div>' +
                      '<div class="preview"><p>Preview:</p>' +
                      '<image id="imagePreview" src="/images/empty.gif" /> <br />' +
                      '<input type="button" value="Select File" id="selectFileButton" /></div>')
		.dialog({
			autoOpen: false,
			title: 'Select image',
                        width: 600,
                        height: 400
		});

   $('#fileTree').fileTree({
        root: 'drawable/',
        script: '/ajax/show_dir',
        projectId: project_id,
        expandSpeed: 300,
        collapseSpeed: 300,
        multiFolder: true
    }, function(file) {
         // Debug:
         // alert("/projects/" + project_id + file);
        $("#imagePreview").attr("src", "/projects/" + project_id + "/" + file);
        selectedImage = file;
    });

   $('#selectFileButton').click(function() {
     if (selectedImage == "") {
       alert("Please select an image");
     }
     else {
      $dialog.dialog('close');
      var cmd = new UpdateStartScreenImageCommand();
      cmd.setParameter("mission_id", mission_id);
      cmd.setParameter("project_id", project_id);
      cmd.setParameter("image", selectedImage);
      cmd.execute();
     }
   });


	$('#changeStartscreenButton').click(function() {
		selectedImage = "";
                $("#imagePreview").attr("src","/images/empty.gif");
                $dialog.dialog('open');
		// prevent the default action, e.g., following a link
		return false;
	});
});