/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
$(document).ready(function() {
   $("#urlEdit").editable(onUrlChange, { placeholder: "Click to add an URL" });
   $("#buttonEdit").editable(onButtonChange, { placeholder: "Click to add a text (optional)" });

});

$(document).ready(function() {
   $("#fileUploadForm").ajaxForm({
       success : onUploadSuccess,
   });
});

function onUploadSuccess() {
   $("#uploadResult").addClass("success")
                     .text("Upload successful");
   cmd = new SetWebPageFileCommand();
   cmd.setParameter("project_id", project_id);
   cmd.setParameter("mission_id", mission_id);
   cmd.setParameter("file", "html/m" + mission_id + ".html");
   cmd.execute();
}

function onUrlChange(value, settings) {
   cmd = new SetWebPageUrlCommand();
   cmd.setParameter("project_id", project_id);
   cmd.setParameter("mission_id", mission_id);
   cmd.setParameter("url", value);
   cmd.execute();
   return value;
}

function onButtonChange(value, settings) {
   cmd = new SetWebPageButtonTextCommand();
   cmd.setParameter("project_id", project_id);
   cmd.setParameter("mission_id", mission_id);
   cmd.setParameter("button_text", value);
   cmd.execute();
   return value;
}