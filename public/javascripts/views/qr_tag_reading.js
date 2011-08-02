/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
$(document).ready(function() {
   $("#editTaskDescription").editable(onTaskDescriptionChange, { placeholder: "Click to add a text (optional)" });
   $("#editEndButtonText").editable(onEndButtonChange, { placeholder: "Click to add a text (optional)" });
   $("#editFeedBackText").editable(onFeedBackTextChange, { placeholder: "Click to add a text (optional)" });
   $("#editExpectedContent").editable(onExpectedContentChange, { placeholder: "Click to specify the expected content" });
   $("#editIfRight").editable(onIfRightChange, { placeholder: "Click to add a text (optional)" });
   $("#editIfWrong").editable(onIfWrongChange, { placeholder: "Click to add a text (optional)" });

   $("#treasureRadio").change(onModeChange);
   $("#productRadio").change(onModeChange);

});

function onModeChange() {
    var mode = $("input[@name='mode']:checked").val();

    if(mode == "treasure") {
        $("#treasureAttributes").removeClass("hidden");
        $("#productAttributes").addClass("hidden");
    }

    if(mode == "product") {
        $("#treasureAttributes").addClass("hidden");
        $("#productAttributes").removeClass("hidden");
    }

    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "mode");
    cmd.setParameter("value", mode);
    cmd.execute();
}

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

function onTaskDescriptionChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "taskdescription");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onEndButtonChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "endbuttontext");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onFeedBackTextChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "feedbacktext");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onExpectedContentChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "expected_content");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onIfRightChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "if_right");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}

function onIfWrongChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "if_wrong");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}


