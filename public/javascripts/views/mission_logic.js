// Initialize Event Dialog:
$(document).ready(function() {
    $("#eventDialog_dialog").dialog({
        autoOpen: false,
        width: 500,
        height: 300
    });


    $("#eventDialog_addRequirement").click(function() {
        var type = $("#eventDialog_addRequirementType").val();

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
            initFunction[type]();
        }
        else {
            alert("This requirement is not implemented yet");
        }

    });


    // Create the new event
    $("#eventDialog_createButton").click(function() {

        $("#eventDialog_dialog").dialog("close");

        nextMission = $("#eventDialog_nextMission").val();
        requirements = $("#eventDialog_dialog").data("geoquest.requirements");
        commands = $("#eventDialog_dialog").data("geoquest.commands");
        type = $("#eventDialog_dialog").data("geoquest.event_type");

        // TODO: Do Ajax call:
        id = "e" + (100 + parseInt( Math.random() * 800));
        event = {
            "next_mission" : nextMission,
            "requirements" : requirements,
            "commands" : commands,
            "type" : type,
            "id" : id
        };

        cmd = new CreateNewEventCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("event_holder", $("#eventDialog_dialog").data("geoquest.object"));
        cmd.setParameter("event_holder_type", $("#eventDialog_dialog").data("geoquest.type"));
        cmd.setParameter("event", event);
        cmd.execute();
    });

});

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
       $("#missionRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(requirement);
    });

});

function recomputeReqInHotspotRangeStatus() {
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


function recomputeReqOutHotspotRangeStatus() {
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

// Initialize In Hotspot Range Requirement Dialog
$(document).ready(function() {
    $("#inHotspotRangeRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqInRange requirement",
        width: 400,
        height: 300
    });

    $("#inHotspotRangeRequirementDialog_hotspot").change(recomputeReqInHotspotRangeStatus)
    $("#inHotspotRangeRequirementDialog_createButton").click(function() {
       requirement = $("#inHotspotRangeRequirementDialog_dialog").data("geoquest.requirement");
       $("#inHotspotRangeRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(requirement);
    });

});

// Initialize Out Hotspot Range Requirement Dialog
$(document).ready(function()  {
    $("#outHotspotRangeRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqOutRange requirement",
        width: 400,
        height: 300
    });

    $("#outHotspotRangeRequirementDialog_hotspot").change(recomputeReqOutHotspotRangeStatus)
    $("#outHotspotRangeRequirementDialog_createButton").click(function() {
       requirement = $("#outHotspotRangeRequirementDialog_dialog").data("geoquest.requirement");
       $("#outHotspotRangeRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(requirement);
    });

});


function recomputeReqAttributeStatus() {
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


// Initialize Attribute Requirement Dialog
$(document).ready(function() {
    $("#attributeRequirementDialog_dialog").dialog({
        autoOpen: false,
        title: "Create new reqAttribute requirement",
        width: 400,
        height: 300
    });

    $("#attributeRequirementDialog_attribute").change(recomputeReqAttributeStatus)
    $("#attributeRequirementDialog_value").change(recomputeReqAttributeStatus)
    $("#attributeRequirementDialog_attribute").keyup(recomputeReqAttributeStatus)
    $("#attributeRequirementDialog_value").keyup(recomputeReqAttributeStatus)

    $("#attributeRequirementDialog_createButton").click(function() {
       requirement = $("#attributeRequirementDialog_dialog").data("geoquest.requirement");
       $("#attributeRequirementDialog_dialog").dialog("close");
       addRequirementToEventDialog(requirement);
    });

});


function initEventDialog(type) {
    $("#eventDialog_dialog").data("geoquest.event_type", type);
    $("#eventDialog_dialog").data("geoquest.requirements", []);
    $("#eventDialog_dialog").data("geoquest.commands", []);
    $("#eventDialog_nextMission").selectOptions("none", true);
    $(".event-dialog-dynamic-content").remove();
}

function initReqMissionStatusDialog() {
    $(".missionRequirementDialog-checkbox").attr("checked", false);
    // None does not exist in this list, but in this way the list is set back
    // to the first element
    $("#missionRequirementDialog_mission").selectOptions("none", true);
    recomputeReqMissionStatus();
}



function initReqInHotspotRangeDialog() {
    $("#inHotspotRangeRequirementDialog_hotspot option:first-child").attr("selected", "selected");
    recomputeReqInHotspotRangeStatus();
}

function initReqOutHotspotRangeDialog() {
    $("#outHotspotRangeRequirementDialog_hotspot option:first-child").attr("selected", "selected");
    recomputeReqOutHotspotRangeStatus();
}

function initReqAttributeDialog() {
    $("#attributeRequirementDialog_attribute").val("");
    $("#attributeRequirementDialog_value").val("");
    recomputeReqAttributeStatus();
}


// Adds a new requirement to the dialog
function addRequirementToEventDialog(requirement) {
     $("#eventDialog_dialog").data("geoquest.requirements").push(requirement);
     newElement = $("<li></li>").text(requirement.description)
                                .addClass("event-dialog-dynamic-content")
     $("#eventDialog_addRequirementListEntry").before(newElement);
}


// Recomputes the mission Status requirement, if it is changed in the corresponding dialog
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

// from can be either a mission or a hotspot description. It only has to have an id
function addJsplumbConnection( from, event) {

  // Not all events are a Mission call:
  if(event.next_mission == null) return;

  style = {
    lineWidth: 3,
    strokeStyle: "black"
  };

  hoverStyle = {
    lineWidth: 6,
    strokeStyle: "blue"
  };

  my_overlays = [[ "Arrow", {location:0.9} ]];

  anchors = ["TopLeft", "TopCenter", "TopRight", "LeftMiddle", "RightMiddle",
             "BottomLeft", "BottomCenter", "BottomRight"];

  jsPlumb.connect({
      source: (from.id + "-box"),
      target: (event.next_mission + "-box"),
      paintStyle: style,
      hoverPaintStyle: hoverStyle,
      overlays: my_overlays,
      endpoint: ["Dot", {radius: 1}],
      label: event.type,
      connector: ["Bezier", {curviness: 30}],
      dynamicAnchors: anchors,
      labelStyle : {fillStyle:"rgba(255,255,255, 0.8)", color:"black",borderWidth:10}

} );


}

function createNewEvent(type, element) {
    initEventDialog(type);
    var title = "Create new " + type + " event in " + element.data("geoquest.name");
    $("#eventDialog_dialog").dialog("option", "title", title)
                            .data("geoquest.type", element.data("geoquest.type"))
                            .data("geoquest.object", element.data("geoquest.object"))
                            .dialog("open");
}

function listEvents(element) {
    alert("List events...")
}

function contextMenuCallback(action, element, pos) {
    actionMapping = {
        "addOnEnd" : "onEnd",
        "addOnFail" : "onFail",
        "addOnSuccess" : "onSuccess",
        "addOnTap" : "onTap",
        "addOnEnter" : "onEnter"
    }

    if (action in actionMapping) {
        createNewEvent(actionMapping[action], element);
    }
    else if (action == "listEvents") {
        listEvents(element);
    }
    else {
        alert("Error. Unknown action '" + action + "' in contextMenuCallback");
    }


}


function addElements(data) {

    missions = data.missions;
    hotspots = data.hotspots;

    // Add Mission elements:
    $.each(missions, function(mission_index, mission) {
       var element = $('<div></div>')
                        .html("<p>" + mission.name + "</p>")
                        .addClass("mission-box")
                        .attr("id", mission.id + "-box")
                        .css("left", mission.visualization.x)
                        .css("top", mission.visualization.y)
                        .data("geoquest.type", "mission")
                        .data("geoquest.name", mission.name)
                        .data("geoquest.object", mission)
                        .data("geoquest.mission", mission);
       $(".content").append(element)
       jsPlumb.draggable(element);
       element.bind("drag", function(event, ui) {
        cmd = new MoveMissionVisualizationCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("mission_id", mission.id);
        cmd.setParameter("x", ui.position.left);
        cmd.setParameter("y", ui.position.top);
        cmd.execute();
       });
       element.contextMenu(
         {menu: 'missionMenu'},
         contextMenuCallback
        );
    });

    // Add Hotspot elements:
    $.each(hotspots, function(hotspot_index, hotspot) {
       if(!hotspot.name) hotspot.name = hotspot.id;
       var element = $('<div></div>')
                    .addClass("hotspot-box")
                    .attr("id", hotspot.id + "-box")
                    .html("<p>" + hotspot.name + "</p>")
                    .css("left", hotspot.visualization.x)
                    .css("top", hotspot.visualization.y)
                    .data("geoquest.type", "hotspot")
                    .data("geoquest.object", hotspot)
                    .data("geoquest.hotspot", hotspot)
                    .data("geoquest.name", hotspot.name);
       $(".content").append(element);
       jsPlumb.draggable(element);

       element.bind("drag", function(event, ui) {
        cmd = new MoveHotspotVisualizationCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("hotspot_id", hotspot.id);
        cmd.setParameter("x", ui.position.left);
        cmd.setParameter("y", ui.position.top);
        cmd.execute();
       });

       element.contextMenu(
         {menu: 'hotspotMenu'},
         contextMenuCallback
        );

    });

    // Add connections from Mission to Mission:
    $.each(missions, function(mission_index, mission) {
       $.each(mission.on_success, function(event_index, event) {addJsplumbConnection( mission, event);});
       $.each(mission.on_end, function(event_index, event) {addJsplumbConnection( mission, event);});
       $.each(mission.on_fail, function(event_index, event) {addJsplumbConnection( mission, event);});
    });

    // Add connections from Hotspot to Mission:
    $.each(hotspots, function(hotspot_index, hotspot) {
       $.each(hotspot.on_enter, function(event_index, event) {addJsplumbConnection( hotspot, event);});
       $.each(hotspot.on_tap, function(event_index, event) {addJsplumbConnection( hotspot, event);});
    });

}

// Fills the lists in the dialogs
// with the missions or hotspots
function initDialogLists(data) {
   $("#eventDialog_nextMission").addOption("none", "[none]");
   $.each(data.missions, function(mission_index, mission) {
       $("#eventDialog_nextMission").addOption(mission.id, mission.name);
       $("#missionRequirementDialog_mission").addOption(mission.id, mission.name);
   });

   $.each(data.hotspots, function(hotspot_index, hotspot) {
       $("#inHotspotRangeRequirementDialog_hotspot").addOption(hotspot.id, hotspot.name);
       $("#outHotspotRangeRequirementDialog_hotspot").addOption(hotspot.id, hotspot.name);
   });

}

function onMissionDataReceived(data) {
   addElements(data);
   initDialogLists(data);
}

$(document).ready(function() {

    jsPlumb.setMouseEventsEnabled(true);

    $.ajax({
        url: "/ajax/show_mission_interconnections",
        data : {
            "project_id" : project_id
        },
        success : onMissionDataReceived,
        error : function() {
            alert("Something has gone wrong");
        }
    });


});
