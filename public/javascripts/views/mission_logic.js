// Initialize Event Dialog:
$(document).ready(function() {
    $("#eventDialog_dialog").dialog({
        autoOpen: false,
        width: 500,
        height: 300
    });

    $("#eventDialog_dialog").data("geoquest.requirements", []);

    $("#eventDialog_addRequirement").click(function() {
        var type = $("#eventDialog_addRequirementType").val();

        var dialogId = {
            "reqMissionStatus" : "#missionRequirementDialog_dialog"
        }
        var initFunction = {
            "reqMissionStatus" : recomputeReqMissionStatus
        }

        if (type in dialogId) {
            $(dialogId[type]).dialog("open");
            initFunction[type]();
        }
        else {
            alert("This requirement is not implemented yet");
        }

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

});



// Recomputes the mission Status requirement, if it is changed in the corresponding dialog
function recomputeReqMissionStatus() {
    var _new = $("#missionRequirementDialog_new").is(':checked');
    var fail = $("#missionRequirementDialog_fail").is(':checked');
    var success = $("#missionRequirementDialog_success").is(':checked');
    var running = $("#missionRequirementDialog_running").is(':checked');

    var mission = $("#missionRequirementDialog_mission").is(':checked');
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


    $("#missionRequirementDialog_requirement").text(requirement_text);
    // Todo save requirement somewhere


}

// from can be either a mission or a hotspot description. It only has to have an id
function addJsplumbConnection(data, from, event) {

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
    var title = "Create new " + type + " event in " + element.data("geoquest.name");
    $("#eventDialog_dialog").dialog("option", "title", title)
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
       $.each(mission.on_success, function(event_index, event) {addJsplumbConnection(data, mission, event);});
       $.each(mission.on_end, function(event_index, event) {addJsplumbConnection(data, mission, event);});
       $.each(mission.on_fail, function(event_index, event) {addJsplumbConnection(data, mission, event);});
    });

    // Add connections from Hotspot to Mission:
    $.each(hotspots, function(hotspot_index, hotspot) {
       $.each(hotspot.on_enter, function(event_index, event) {addJsplumbConnection(data, hotspot, event);});
       $.each(hotspot.on_tap, function(event_index, event) {addJsplumbConnection(data, hotspot, event);});
    });

}

function initMissionRequirementDialogList(data) {
   $.each(data.missions, function(mission_index, mission) {
       $("#missionRequirementDialog_mission").addOption(mission.id, mission.name);
   });
}

function onMissionDataReceived(data) {
   addElements(data);
   initMissionRequirementDialogList(data);
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
