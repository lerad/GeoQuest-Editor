// For mission interconnection

// Gets a div id and initializes it, such that it shows an event
function createEventDisplay(selector) {
    // Copy event form into container
    $(selector).append($("#event_description").contents().clone(true));

    $.ajax({
        url: "/ajax/show_mission_interconnections",
        data : {
            "project_id" : project_id
        },
        success : function(data) {
            $.each(data.missions, function(mission_index, mission) {
                $(selector).find("#event_nextMission").addOption(mission.id, mission.name);
            });
        }
    });
    

    $(selector).find("#event_addRequirement").click(function() {
        var type = $(selector).find("#event_addRequirementType").val();

        var dialogId = {
            "reqMissionStatus" : "#missionRequirementDialog_dialog",
            "reqInRange" : "#inHotspotRangeRequirementDialog_dialog",
            "reqOutRange" : "#outHotspotRangeRequirementDialog_dialog",
            "reqAttribute" : "#attributeRequirementDialog_dialog"
        }
        var initFunction = {
            "reqMissionStatus" : initReqMissionStatusDialog,
            "reqInRange" : initReqInHotspotRangeDialog,
            "reqOutRange" : initReqOutHotspotRangeDialog,
            "reqAttribute" : initReqAttributeDialog
        }

        if (type in dialogId) {
            $(dialogId[type]).dialog("open");
            initFunction[type](selector);
        }
        else {
            alert("This requirement is not implemented yet");
        }

    });

    $(selector).find("#event_addCommand").click(function() {
        var type = $(selector).find("#event_addCommandType").val();

        var dialogId = {
            "comMessage" : "#messageCommandDialog_dialog",
            "comAttribute" : "#attributeCommandDialog_dialog",
            "comPlaySound" : "#playSoundCommandDialog_dialog"
        };

        var initFunction = {
            "comMessage" : initComMessageDialog,
            "comAttribute" : initComAttributeDialog,
            "comPlaySound" : initComPlaySoundDialog
        };

        if (type in dialogId) {
            $(dialogId[type]).dialog("open");
            initFunction[type](selector);
        }
        else {
            alert("This command is not implemented yet");
        }

    });

}

function getEvent(selector) {
        nextMission = $(selector).find("#event_nextMission").val();
        requirements = $(selector).data("geoquest.requirements");
        commands = $(selector).data("geoquest.commands");
        type = $(selector).data("geoquest.event_type");

        event = {
            "next_mission" : nextMission,
            "requirements" : requirements,
            "commands" : commands,
            "type" : type,
            "holder" : $(selector).data("geoquest.event_holder"),
            "holder_type" : $(selector).data("geoquest.event_holder_type")
        };
        return event;
}

function initEventDisplay(selector, new_type, holder, holder_type) {
    $(selector).data("geoquest.event_type", new_type);
    $(selector).data("geoquest.requirements", []);
    $(selector).data("geoquest.commands", []);
    $(selector).data("geoquest.event_holder", holder);
    $(selector).data("geoquest.event_holder_type", holder_type);
    $(selector).find("#event_nextMission").selectOptions("none", true);
    $(selector).find(".event-dialog-dynamic-content").remove();
}

function loadEventDisplay(selector, event) {
    /* TODO: implement */
}



// Adds a new requirement to the dialog
function addRequirementToEventDialog(selector, requirement) {
     $(selector).data("geoquest.requirements").push(requirement);
     newElement = $("<li></li>").text(requirement.description)
                                .addClass("event-dialog-dynamic-content")
     $(selector).find("#event_addRequirementListEntry").before(newElement);
     $(selector).trigger("geoquest.event_change");
}

// Adds a new command to the dialog
function addCommandToEventDialog(selector, command) {
     $(selector).data("geoquest.commands").push(command);
     newElement = $("<li></li>").text(command.description)
                                .addClass("event-dialog-dynamic-content")
     $(selector).find("#event_addCommandListEntry").before(newElement);
     $(selector).trigger("geoquest.event_change");
}

/*****************************************************
 * Mission Requirement Dialog
 * Used to create new requirements of the type "reqMissionStatus"
 *****************************************************/

// Initialize Mission Requirement Dialog
$(document).ready(function() {
    $("#missionRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqMissionStatus requirement",
        width: 450,
        height: 400
    });

    $(".missionRequirementDialog-checkbox").change(recomputeReqMissionStatus)
    $("#missionRequirementDialog_mission").change(recomputeReqMissionStatus)

    $("#missionRequirementDialog_createButton").click(function() {
       requirement = $("#missionRequirementDialog_dialog").data("geoquest.requirement");
       selector = $("#missionRequirementDialog_dialog").data("geoquest.selector");
       
       $("#missionRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(selector, requirement);
    });

});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initReqMissionStatusDialog(selector) {
    $(".missionRequirementDialog-checkbox").attr("checked", false);
    // None does not exist in this list, but in this way the list is set back
    // to the first element
    $("#missionRequirementDialog_mission").selectOptions("none", true);
    $("#missionRequirementDialog_dialog").data("geoquest.selector", selector);
    recomputeReqMissionStatus();
}

// Is called everytime a value changes and
// recomputes the requirement object, and its description
function recomputeReqMissionStatus() {
    var _new = $("#missionRequirementDialog_new").is(':checked');
    var fail = $("#missionRequirementDialog_fail").is(':checked');
    var success = $("#missionRequirementDialog_success").is(':checked');
    var running = $("#missionRequirementDialog_running").is(':checked');

    var mission = $("#missionRequirementDialog_mission").val();
    var mission_name = $("#missionRequirementDialog_mission option:selected").text();
    var requirement_text = "";

    status = [];
    if (_new) status.push("new");
    if (fail) status.push("fail");
    if (success) status.push("success");
    if (running) status.push("running");

    if(status.length == 0) {
        requirement_text = "Never";
    }
    else if(status.length == 4) {
        requirement_text = "Always";
    }
    else if (status.length == 1) {
        requirement_text = "If " + mission_name + " has the status " + status[0];
    }
    else {
        requirement_text = "If " + mission_name + " has the status ";
        for (i = 0; i < status.length -1; i++) {
            requirement_text += (status[i] + ", ");
        }
        requirement_text += "or ";
        requirement_text += status[status.length-1];
    }

    xml = '<reqMissionStatus id="' + mission +
            '" new="' + _new +
            '" success="' + success +
            '" fail="' + fail +
            '" running="' + running + '" />';

    requirement = {
        "type" : "reqMissionStatus",
        "new" : _new,
        "fail" : fail,
        "success" : success,
        "running" : running,
        "requiredMission" : mission,
        "requiredMissionName" : mission_name,
        "description" : requirement_text,
        "xml" : xml
    }

    $("#missionRequirementDialog_dialog").data("geoquest.requirement", requirement);

    $("#missionRequirementDialog_requirement").text(requirement_text);


}

/*****************************************************
 * In Hospot Range Requirement Dialog
 * Used to create new requirements of the type "reqInRange"
 *****************************************************/

// Initialize In Hotspot Range Requirement Dialog
$(document).ready(function() {
    $("#inHotspotRangeRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqInRange requirement",
        width: 400,
        height: 300
    });

    $("#inHotspotRangeRequirementDialog_hotspot").change(recomputeReqInHotspotRange)
    $("#inHotspotRangeRequirementDialog_createButton").click(function() {
       requirement = $("#inHotspotRangeRequirementDialog_dialog").data("geoquest.requirement");
       selector = $("#inHotspotRangeRequirementDialog_dialog").data("geoquest.selector");
       $("#inHotspotRangeRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(selector, requirement);
    });

});


// Is called everytime a value changes and
// recomputes the requirement object, and its description
function recomputeReqInHotspotRange() {
    var hotspot = $("#inHotspotRangeRequirementDialog_hotspot").val();
    var hotspot_name = $("#inHotspotRangeRequirementDialog_hotspot option:selected").text();

    var requirement_text = "If the player is inside of the range of " + hotspot_name;

    xml = '<reqInRange id="' + hotspot + '" />';

    requirement = {
        "type" : "reqInRange",
        "requiredHotspot" : hotspot,
        "requiredHotspotName" : hotspot_name,
        "description" : requirement_text,
        "xml" : xml
    };

    $("#inHotspotRangeRequirementDialog_dialog").data("geoquest.requirement", requirement);

    $("#inHotspotRangeRequirementDialog_requirement").text(requirement_text);
}

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initReqInHotspotRangeDialog(selector) {
    $("#inHotspotRangeRequirementDialog_hotspot option:first-child").attr("selected", "selected");
    $("#inHotspotRangeRequirementDialog_dialog").data("geoquest.selector", selector);
    recomputeReqInHotspotRange();
}

/*****************************************************
 * Out Hospot Range Requirement Dialog
 * Used to create new requirements of the type "reqOutRange"
 *****************************************************/



// Initialize Out Hotspot Range Requirement Dialog
$(document).ready(function()  {
    $("#outHotspotRangeRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqOutRange requirement",
        width: 400,
        height: 300
    });

    $("#outHotspotRangeRequirementDialog_hotspot").change(recomputeReqOutHotspotRange)
    $("#outHotspotRangeRequirementDialog_createButton").click(function() {
       requirement = $("#outHotspotRangeRequirementDialog_dialog").data("geoquest.requirement");
       selector = $("#outHotspotRangeRequirementDialog_dialog").data("geoquest.selector");
       $("#outHotspotRangeRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(selector, requirement);
    });

});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initReqOutHotspotRangeDialog(selector) {
    $("#outHotspotRangeRequirementDialog_hotspot option:first-child").attr("selected", "selected");
    $("#outHotspotRangeRequirementDialog_dialog").data("geoquest.selector", selector);
    recomputeReqOutHotspotRange();
}

// Is called everytime a value changes and
// recomputes the requirement object, and its description
function recomputeReqOutHotspotRange() {
    var hotspot = $("#outHotspotRangeRequirementDialog_hotspot").val();
    var hotspot_name = $("#outHotspotRangeRequirementDialog_hotspot option:selected").text();

    var requirement_text = "If the player is outside of the range of " + hotspot_name;

    xml = '<reqOutRange id="' + hotspot + '" />';

    requirement = {
        "type" : "reqOutRange",
        "requiredHotspot" : hotspot,
        "requiredHotspotName" : hotspot_name,
        "description" : requirement_text,
        "xml" : xml
    }

    $("#outHotspotRangeRequirementDialog_dialog").data("geoquest.requirement", requirement);

    $("#outHotspotRangeRequirementDialog_requirement").text(requirement_text);

}


/*****************************************************
 * Attribute Requirement Dialog
 * Used to create new requirements of the type "reqAttribute"
 *****************************************************/



// Initialize Attribute Requirement Dialog
$(document).ready(function() {
    $("#attributeRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqAttribute requirement",
        width: 400,
        height: 300
    });

    $("#attributeRequirementDialog_attribute").change(recomputeReqAttribute);
    $("#attributeRequirementDialog_value").change(recomputeReqAttribute);
    $("#attributeRequirementDialog_attribute").keyup(recomputeReqAttribute);
    $("#attributeRequirementDialog_value").keyup(recomputeReqAttribute);

    $("#attributeRequirementDialog_createButton").click(function() {
       requirement = $("#attributeRequirementDialog_dialog").data("geoquest.requirement");
       selector = $("#attributeRequirementDialog_dialog").data("geoquest.selector");

       $("#attributeRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(selector, requirement);
    });

});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initReqAttributeDialog(selector) {
    $("#attributeRequirementDialog_attribute").val("");
    $("#attributeRequirementDialog_value").val("");
    $("#attributeRequirementDialog_dialog").data("geoquest.selector", selector);
    recomputeReqAttribute();
}

// Is called everytime a value changes and
// recomputes the requirement object, and its description
function recomputeReqAttribute() {
    name =     $("#attributeRequirementDialog_attribute").val();
    value = $("#attributeRequirementDialog_value").val();

    requirement_text = 'If the attribute "' + name + '" has the value "' + value + '"';
    xml = '<reqAttribute name="' + name + '" value="' + value + '" />';


    requirement = {
        "type" : "reqAttribute",
        "attribute" : name,
        "value" : value,
        "description" : requirement_text,
        "xml" : xml
    }

    $("#attributeRequirementDialog_dialog").data("geoquest.requirement", requirement);

    $("#attributeRequirementDialog_requirement").text(requirement_text);

}

/*****************************************************
 * Message Command Dialog
 * Used to create new commands of the type "comMessage"
 *****************************************************/


// Initialize Message Command Dialog
$(document).ready(function() {
    $("#messageCommandDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new comMessage Command",
        width: 400,
        height: 300
    });

    $("#messageCommandDialog_message").change(recomputeComMessage);
    $("#messageCommandDialog_message").keyup(recomputeComMessage);

    $("#messageCommandDialog_createButton").click(function() {
       command = $("#messageCommandDialog_dialog").data("geoquest.command");
       selector = $("#messageCommandDialog_dialog").data("geoquest.selector");
       $("#messageCommandDialog_dialog").dialog("close");
       addCommandToEventDialog(selector, command);
    });

});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initComMessageDialog(selector) {
    $("#messageCommandDialog_message").val("");
    $("#messageCommandDialog_dialog").data("geoquest.selector", selector);
    recomputeComMessage();
}

// Is called everytime a value changes and
// recomputes the command object, and its description
function recomputeComMessage() {
    message = $("#messageCommandDialog_message").val();

    command_text = 'Show the message "' + message + '"';
    xml = '<comMessage text="' + message + '" />';

    command = {
        "type" : "comMessage",
        "message" : message,
        "description" : command_text,
        "xml" : xml
    };

    $("#messageCommandDialog_dialog").data("geoquest.command", command);

    $("#messageCommandDialog_command").text(command_text);

}

/*****************************************************
 * Attribute Command Dialog
 * Used to create new commands of the type "comAttribute"
 *****************************************************/


// Initialize Attribute Command Dialog
$(document).ready(function() {
    $("#attributeCommandDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new comAttribute Command",
        width: 400,
        height: 300
    });

    $("#attributeCommandDialog_attribute").change(recomputeComAttribute);
    $("#attributeCommandDialog_attribute").keyup(recomputeComAttribute);
    $("#attributeCommandDialog_value").change(recomputeComAttribute);
    $("#attributeCommandDialog_value").keyup(recomputeComAttribute);

    $("#attributeCommandDialog_createButton").click(function() {
       command = $("#attributeCommandDialog_dialog").data("geoquest.command");
       selector = $("#attributeCommandDialog_dialog").data("geoquest.selector");
       $("#attributeCommandDialog_dialog").dialog("close");
       addCommandToEventDialog(selector, command);
    });

});
//
// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initComAttributeDialog() {
    $("#attributeCommandDialog_attribute").val("");
    $("#attributeCommandDialog_value").val("");
    $("#attributeCommandDialog_dialog").data("geoquest.selector", selector);
    recomputeComAttribute();
}

// Is called everytime a value changes and
// recomputes the command object, and its description
function recomputeComAttribute() {
    attribute = $("#attributeCommandDialog_attribute").val();
    value = $("#attributeCommandDialog_value").val();

    command_text = 'Set the attribute "' + attribute + '" to the value"' + value + '"';
    xml = '<comAttribute name="' + attribute + '" value="' + value + '" />';

    command = {
        "type" : "comAttribute",
        "attribute" : attribute,
        "value" : value,
        "description" : command_text,
        "xml" : xml
    };

    $("#attributeCommandDialog_dialog").data("geoquest.command", command);

    $("#attributeCommandDialog_command").text(command_text);

}



/*****************************************************
 * Play Sound Command Dialog
 * Used to create new commands of the type "comAttribute"
 *****************************************************/


// Initialize Play Sound Command Dialog
$(document).ready(function() {
    $("#playSoundCommandDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new comPlaySound Command",
        width: 400,
        height: 300
    });

    $("#playSoundCommandDialog_createButton").click(function() {
       command = $("#playSoundCommandDialog_dialog").data("geoquest.command");
       selector = $("#playSoundCommandDialog_dialog").data("geoquest.selector");

       $("#playSoundCommandDialog_dialog").dialog("close");
       addCommandToEventDialog(selector, command);
    });

});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initComPlaySoundDialog(selector) {

    $("#playSoundCommandDialog_fileTree").fileTree({
        root: 'sound/',
        script: '/ajax/show_dir',
        projectId: project_id,
        expandSpeed: 300,
        collapseSpeed: 300,
        multiFolder: true
    }, function(file) {
        $("#playSoundCommandDialog_dialog").data("geoquest.file", file);
        recomputeComPlaySound();
    });

    $("#playSoundCommandDialog_dialog").data("geoquest.file", "");
    $("#playSoundCommandDialog_dialog").data("geoquest.selector", selector);
    recomputeComPlaySound();
}

// Is called everytime a value changes and
// recomputes the command object, and its description
function recomputeComPlaySound() {

    file = $("#playSoundCommandDialog_dialog").data("geoquest.file");

    command_text = 'Play the sound "' +  file + '"';
    xml = '<comPlaySound file="' + file + '" />';

    command = {
        "type" : "comPlaySound",
        "file" : file,
        "description" : command_text,
        "xml" : xml
    };

    $("#playSoundCommandDialog_dialog").data("geoquest.command", command);

    $("#playSoundCommandDialog_command").text(command_text);

}

