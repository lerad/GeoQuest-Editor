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

}

function createShowMessageAction(selector) {

}

function createDecrementVariableAction(selector) {

}

function createIncrementVariableAction(selector) {

}

function createSetVariableAction(selector) {

}

function createSetHotspotVisibilityAction(selector) {
    
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




// Adds a new action to the dialog
function addActionToRuleDialog(selector, action) {
    // TODO: Compute description via external means
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

    var newElement = $("<li></li>").text(action.type)
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


/*****************************************************
 * Play Sound Command Dialog
 * Used to create new commands of the type "comAttribute"
 *****************************************************/

/*
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
       addCommandToRuleDialog(selector, command);
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

*/
