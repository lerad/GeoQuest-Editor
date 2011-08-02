/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
// For mission interconnection


$(document).ready(function() {
    $("#startMissionDialog_dialog").dialog({
        autoOpen: false,
        width: 200,
        height: 150,
        modal: false
    });

    $("#startMissionDialog_createButton").click(function() {
        var id = $("#startMissionDialog_mission").val();
        var action = {
            "type" : "StartMission",
            "id" : id
        };
        var selector = $("#startMissionDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);
        $(selector).data("geoquest.next_mission", id);

        $("#startMissionDialog_dialog").dialog("close");
    });

});

$(document).ready(function() {
    $("#setHotspotVisibilityDialog_dialog").dialog({
        autoOpen: false,
        width: 200,
        height: 150,
        modal: false
    });

    $("#setHotspotVisibilityDialog_createButton").click(function() {
        var id = $("#setHotspotVisibilityDialog_hotspot").val();
        var visible = $("#setHotspotVisibilityDialog_visible").val();
        var action = {
            "type" : "SetHotspotVisibility",
            "id" : id,
            "visible" : visible
        };
        var selector = $("#setHotspotVisibilityDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);

        $("#setHotspotVisibilityDialog_dialog").dialog("close");
    });

});

$(document).ready(function() {
    $("#setVariableDialog_dialog").dialog({
        autoOpen: false,
        width: 400,
        height: 200,
        modal: false
    });

    $("#setVariableDialog_createButton").click(function() {
        var variable = $("#setVariableDialog_variable").val();
        var value = $("#setVariableDialog_value").val();
        var action = {
            "type" : "SetVariable",
            "value" : value,
            "var" : variable
        };
        var selector = $("#setVariableDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);

        $("#setVariableDialog_dialog").dialog("close");
    });

});

$(document).ready(function() {
    $("#incrementVariableDialog_dialog").dialog({
        autoOpen: false,
        width: 400,
        height: 200,
        modal: false
    });

    $("#incrementVariableDialog_createButton").click(function() {
        var variable = $("#incrementVariableDialog_variable").val();
        var action = {
            "type" : "IncrementVariable",
            "var" : variable
        };
        var selector = $("#incrementVariableDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);

        $("#incrementVariableDialog_dialog").dialog("close");
    });

});


$(document).ready(function() {
    $("#decrementVariableDialog_dialog").dialog({
        autoOpen: false,
        width: 400,
        height: 200,
        modal: false
    });

    $("#decrementVariableDialog_createButton").click(function() {
        var variable = $("#decrementVariableDialog_variable").val();
        var action = {
            "type" : "DecrementVariable",
            "var" : variable
        };
        var selector = $("#decrementVariableDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);

        $("#decrementVariableDialog_dialog").dialog("close");
    });

});

$(document).ready(function() {
    $("#showMessageDialog_dialog").dialog({
        autoOpen: false,
        width: 400,
        height: 200,
        modal: false
    });

    $("#showMessageDialog_createButton").click(function() {
        var message = $("#showMessageDialog_message").val();
        var action = {
            "type" : "ShowMessage",
            "message" : message
        };
        var selector = $("#showMessageDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);

        $("#showMessageDialog_dialog").dialog("close");
    });

});


$(document).ready(function() {
    $("#playAudioDialog_dialog").dialog({
        autoOpen: false,
        width: 200,
        height: 300,
        modal: false
    });

    $("#playAudioDialog_fileTree").fileTree({
        root: 'sound/',
        script: '/ajax/show_dir',
        projectId: project_id,
        expandSpeed: 300,
        collapseSpeed: 300,
        multiFolder: true
    }, function(file) {
        $("#playAudioDialog_dialog").data("geoquest.file", file);
    });

    $("#playAudioDialog_createButton").click(function() {
        var file = $("#playAudioDialog_dialog").data("geoquest.file");
        var action = {
            "type" : "PlayAudio",
            "file" : file
        };
        var selector = $("#playAudioDialog_dialog").data("geoquest.selector");
        addActionToRuleDialog(selector, action);

        $("#playAudioDialog_dialog").dialog("close");
    });

});

// Gets a div id and initializes it, such that it shows an rule
function createRuleDisplay(selector) {
    // Copy rule form into container
    $(selector).append($("#rule_description").contents().clone(true));

    initQTip( $(selector).find("#rule_condition") );
   

    $(selector).find("#rule_addAction").click(function() {
        var type = $(selector).find("#rule_addActionType").val();

        var actions = {
            "StartMission" : createStartMissionAction,
            "Vibrate" : createVibrateAction,
            "PlayAudio" : createPlayAudioAction,
            "ShowMessage" : createShowMessageAction,
            "DecrementVariable" : createDecrementVariableAction,
            "IncrementVariable" : createIncrementVariableAction,
            "SetVariable" : createSetVariableAction,
            "SetHotspotVisibility" : createSetHotspotVisibilityAction,
            "EndGame" : createEndGameAction
        };

        if (type in actions) {
            actions[type](selector);
        }
        else {
            alert("Unsupported Action: " + type);
        }

    });

}

/**
 * Actions
 */

function createEndGameAction(selector) {
    var action = {
        "type" : "EndGame"
    };
    addActionToRuleDialog(selector, action);
}

function createStartMissionAction(selector) {
    $("#startMissionDialog_dialog").data("geoquest.selector", selector);
    $("#startMissionDialog_dialog").dialog("open");
}

function createVibrateAction(selector) {
    var action = {
        "type" : "Vibrate"
    };
    addActionToRuleDialog(selector, action);
}

function createPlayAudioAction(selector) {
    $("#playAudioDialog_dialog").data("geoquest.file","");
    $("#playAudioDialog_dialog").data("geoquest.selector",selector);
    $("#playAudioDialog_dialog").dialog("open");

}

function createShowMessageAction(selector) {
    $("#showMessageDialog_dialog").data("geoquest.selector",selector);
    $("#showMessageDialog_dialog").dialog("open");
}

function createDecrementVariableAction(selector) {
    $("#decrementVariableDialog_dialog").data("geoquest.selector",selector);
    $("#decrementVariableDialog_dialog").dialog("open");
}

function createIncrementVariableAction(selector) {
    $("#incrementVariableDialog_dialog").data("geoquest.selector",selector);
    $("#incrementVariableDialog_dialog").dialog("open");
}

function createSetVariableAction(selector) {
    $("#setVariableDialog_dialog").data("geoquest.selector",selector);
    $("#setVariableDialog_dialog").dialog("open");
}

function createSetHotspotVisibilityAction(selector) {
    $("#setHotspotVisibilityDialog_dialog").data("geoquest.selector", selector);
    $("#setHotspotVisibilityDialog_dialog").dialog("open");
}

function getRule(selector) {
        var nextMission = $(selector).data("geoquest.next_mission");
        var actions = $(selector).data("geoquest.actions");
        var type = $(selector).data("geoquest.rule_type");
        var conditionText =  $(selector).find("#rule_condition").val();
        // if it is the first rule of the specified type
        // (aka: Must a new onXYZ Node be created)

        var type2property = {
            "onStart" : "on_start",
            "onEnd" : "on_end",
            "onLeave" : "on_leave",
            "onEnter" : "on_enter",
            "onTap" : "on_tap"
        };

        var prop_name = type2property[type];

        var condition = {};
        if(conditionText != "") {
            var myLexer = new Lexer();
            var myParser = new Parser();
            var myToken = myLexer.getToken(conditionText);
            condition = myParser.parse(myToken);
        }

        var rule = {
            "condition_text" : conditionText,
            "condition" : condition,
            "next_mission" : nextMission,
            "actions" : actions,
            "type" : type
        };
        return rule;
}

function initRuleDisplay(selector, new_type) {
    $(selector).data("geoquest.next_mission", null);
    $(selector).data("geoquest.rule_type", new_type);
    $(selector).data("geoquest.actions", []);
    $(selector).find(".rule-dialog-dynamic-content").remove();
}

function loadRuleDisplay(selector, rule) {
    initRuleDisplay(selector, rule.type);
    $(selector).data("geoquest.next_mission", rule.next_mission);
    $.each(rule.actions, function(index, value) {
        addActionToRuleDialog(selector, value);
    });

    var conditionText = "";
    if (rule.condition_text != null) conditionText = rule.condition_text;

    $(selector).find("#rule_condition").val(conditionText);
}


function startMissionDescription(action) {
    var name = action.id;

    if (missionsData) {
        if (missionsData[action.id].name != "") {
            name = missionsData[action.id].name;
        }
    }
    return 'Start "' + name + '"';
}

function vibrateDescription(action) {
    return "Vibrate";
}

function playAudioDescription(action) {
    return 'Play "' + action.file + '"';
}

function showMessageDescription(action) {
    return 'Display "' + action.message + '"';
}

function decrementVariableDescription(action) {
    return 'decrement the variable "' + action["var"] + "'";
}

function incrementVariableDescription(action) {
    return 'increment the variable "' + action["var"] + "'";
}

function setVariableDescription(action) {
    return 'set the variable "' + action["var"] + '" to "' + action.value + '"';
}

function setHotspotVisibilityDescription(action) {
    if(action.visible == "true") {
        return "Make the hotspot " + action.id + " visible";
    }
    else if (action.visible == "false") {
        return "Make the hotspot " + action.id + " invisible";
    }
    else {
        alert("Error action.visible =" + action.visible + ". It should be true or false");
    }
}

function endGameDescription(action) {
    return "End the game";
}

// Each mission gets the corresponding action and returns a descriptive text
actionDescriber = {
        "StartMission" : startMissionDescription,
        "Vibrate" : vibrateDescription,
        "PlayAudio" : playAudioDescription,
        "ShowMessage" : showMessageDescription,
        "DecrementVariable" : decrementVariableDescription,
        "IncrementVariable" : incrementVariableDescription,
        "SetVariable" : setVariableDescription,
        "SetHotspotVisibility" : setHotspotVisibilityDescription,
        "EndGame" : endGameDescription
};

// Adds a new action to the dialog
function addActionToRuleDialog(selector, action) {

    var description = action.type + " (Unsupported)";

    if (action.type in actionDescriber) {
        var describer = actionDescriber[action.type];
        description = describer(action);
    }

     $(selector).data("geoquest.actions").push(action);
     var img = $("<img></img>")
            .attr("src", "/images/delete.png")
            .css("position", "absolute")
            .css("cursor", "pointer")
            .css("right", "20pt");
     img.click(function() {
        var list = $(selector).find("li");
        var index = list.index($(this).parents("li"));
        deleteActionFromRuleDialog(selector, index);
     });

    var newElement = $("<li></li>").text(description)
                                   .addClass("rule-dialog-dynamic-content")
                                   .append(img);
     $(selector).find("#rule_addActionListEntry").before(newElement);
     $(selector).trigger("geoquest.rule_change");
}

function deleteActionFromRuleDialog(selector, action_index) {
    if($(selector).data("geoquest.actions")[action_index].type == "StartMission") {
        $(selector).data("geoquest.next_mission", null);
    }
    $(selector).data("geoquest.actions").splice(action_index, 1);
    $(selector).find("li").eq(action_index).remove();
}

