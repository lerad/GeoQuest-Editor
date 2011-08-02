/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
$(document).ready(function() {
   $("#editTaskDescription").editable(onTaskDescriptionChange, { placeholder: "Click to add a text (optional)" });
   $("#editButtonText").editable(onButtonTextChange, { placeholder: "Click to add a text (optional)" });
   $("#editUploadUrl").editable(onUploadUrlChange, { placeholder: "Click to add a url (optional)" });

});

var imageSelector = new ImageSelector(null);

$(document).ready(function() {

    imageSelector.setCallback(function(file) {
        $("#initialImage").attr("src", "/projects/" + project_id + "/" + file);
        var cmd = new UpdateAttributeInMissionCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("mission_id", mission_id);
        cmd.setParameter("attribute", "initial_image");
        cmd.setParameter("value", file);
        cmd.execute();
    });

    $("#buttonChangeImage").click(function() {
       imageSelector.show();
    });
});

function onUploadUrlChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "uploadUrl");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onTaskDescriptionChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "taskdescription");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onButtonTextChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "buttontext");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}