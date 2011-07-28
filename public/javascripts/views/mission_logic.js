

/*****************************************************
 *  Event Dialog
 *  Used to create new Events
 *****************************************************/


// Initialize Event Dialog:
$(document).ready(function() {

    createEventDisplay("#eventDialog_event");

    $("#eventDialog_dialog").dialog({
        autoOpen: false,
        width: 500,
        height: 500,
        modal: true
    });


    // Create the new event
    $("#eventDialog_createButton").click(function() {

        $("#eventDialog_dialog").dialog("close");

        event = getEvent("#eventDialog_event");

        $.ajax({
           url: "/ajax/get_next_event_id",
           data : {
               "project_id" : project_id
           },
           success : function(data) {
               event.id = data.next_event_id;
               cmd = new CreateNewEventCommand();
               cmd.setParameter("project_id", project_id);
               cmd.setParameter("event_holder", event.holder);
               cmd.setParameter("event_holder_type", event.holder_type);
               cmd.setParameter("event", event);
               cmd.execute();
           },
           error : function() {
               alert("Could not determine next event id");
           }
       });



    });

});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initEventDialog(type, holder, holder_type) {
    initEventDisplay("#eventDialog_event", type, holder, holder_type);
}




/*********************************
 * Other
 * (Ajax, Jsplump, Contextmenu)
 *********************************/

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

  connection = jsPlumb.connect({
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
    connection.event = event;
    connection.bind('click', openEditEventDialog);
}

function openEditEventDialog(con) {
    alert(con.event.toSource());
}

function createNewEvent(type, element) {
    initEventDialog(type,
                    element.data("geoquest.object"),
                    element.data("geoquest.type"));
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


$(document).ready(function(){
    $("#leftFoldIn").bind("geoquest.resize", function() {
        jsPlumb.repaintEverything();
    });
    $("#rightFoldIn").bind("geoquest.resize", function() {
        jsPlumb.repaintEverything();
    });

});