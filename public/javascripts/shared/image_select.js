ImageSelector = function(callback) {

    var dialogHtml  = '<div class="file-tree" id="fileTree"></div> \
                       <div class="preview"> \
                         <p>Preview:</p> \
                         <image id="imagePreview" src="/images/empty.gif" /> \
                         <br /> \
                         <input type="button" value="Select File" id="selectFileButton" /> \
                      </div>';
    
    var myself = this; // for inner functions. This is saved for the functions ("clusure") but "this" is not

    var options = {
                    autoOpen: false,
                    title: 'Select image',
                    width: 600,
                    height: 400,
                    modal: true
                   };

    this.dialog = $('<div></div>')
		.html(dialogHtml)
		.dialog(options);

    this.callback = callback;

   $('#fileTree').fileTree({
        root: 'drawable/',
        script: '/ajax/show_dir',
        projectId: project_id,
        expandSpeed: 300,
        collapseSpeed: 300,
        multiFolder: true
    }, function(file) {
        $("#imagePreview").attr("src", "/projects/" + project_id + "/" + file);
        myself.selectedImage = file;
    });

   $('#selectFileButton').click(function() {
   if (myself.selectedImage == "") {
       alert("Please select an image");
   }
   else {
        myself.dialog.dialog('close');
        myself.callback(myself.selectedImage);
     }
   });



    this.show = function() {
        myself.selectedImage = "";
        myself.dialog.dialog('open');
    }

}
