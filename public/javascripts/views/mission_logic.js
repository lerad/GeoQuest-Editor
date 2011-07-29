

/*****************************************************
 *  Rule Dialog
 *  Used to create new Rules
 *****************************************************/


// Initialize Rule Dialog:
$(document).ready(function() {

    createRuleDisplay("#ruleDialog_rule");

    $("#ruleDialog_dialog").dialog({
        autoOpen: false,
        width: 500,
        height: 500,
        modal: true
    });


    // Create the new rule
    $("#ruleDialog_createButton").click(function() {

        $("#ruleDialog_dialog").dialog("close");

        rule = getRule("#ruleDialog_rule");

        $.ajax({
           url: "/ajax/get_next_rule_id",
           data : {
               "project_id" : project_id
           },
           success : function(data) {
               rule.id = data.next_rule_id;
               alert("Create rule: " + rule.toSource());
               cmd = new CreateNewRuleCommand();
               cmd.setParameter("project_id", project_id);
               cmd.setParameter("rule_holder", rule.holder);
               cmd.setParameter("rule_holder_type", rule.holder_type);
               cmd.setParameter("rule", rule);
               
               // cmd.execute();
           },
           error : function() {
               alert("Could not determine next rule id");
           }
       });



    });

});



// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initRuleDialog(type, holder, holder_type) {
    initRuleDisplay("#ruleDialog_rule", type, holder, holder_type);
}




/*********************************
 * Other
 * (Ajax, Jsplump, Contextmenu)
 *********************************/

// from can be either a mission or a hotspot description. It only has to have an id
function addJsplumbConnection( from, rule) {

  // Not all rules are a Mission call:
  if(rule.next_mission == null) return;

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
      target: (rule.next_mission + "-box"),
      paintStyle: style,
      hoverPaintStyle: hoverStyle,
      overlays: my_overlays,
      endpoint: ["Dot", {radius: 1}],
      label: rule.type,
      connector: ["Bezier", {curviness: 30}],
      dynamicAnchors: anchors,
      labelStyle : {fillStyle:"rgba(255,255,255, 0.8)", color:"black",borderWidth:10}

} );
    connection.rule = rule;
    connection.bind('click', openEditRuleDialog);
    // connection.bind('mouseenter', function() { console.log("IN"); });
    // connection.bind('mouseexit', function() { console.log("OUT"); });
}

function openEditRuleDialog(con) {
    alert(con.rule.toSource());
}

function createNewRule(type, element) {
    initRuleDialog(type,
                    element.data("geoquest.object"),
                    element.data("geoquest.type"));
    var title = "Create new " + type + " rule in " + element.data("geoquest.name");
    $("#ruleDialog_dialog").dialog("option", "title", title)
                            .dialog("open");
}

function listRules(element) {
    alert("List rules...")
}

function contextMenuCallback(action, element, pos) {
    actionMapping = {
        "addOnEnd" : "onEnd",
        "addOnStart" : "onStart",
        "addOnTap" : "onTap",
        "addOnLeave" : "onLeave",
        "addOnEnter" : "onEnter"
    }

    if (action in actionMapping) {
        createNewRule(actionMapping[action], element);
    }
    else if (action == "listRules") {
        listRules(element);
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
        if(mission.name == "")
            mission.name = mission.id;
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
       element.bind("drag", function(rule, ui) {
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

       element.bind("drag", function(rule, ui) {
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
       $.each(mission.on_start, function(rule_index, rule) {addJsplumbConnection( mission, rule);});
       $.each(mission.on_end, function(rule_index, rule) {addJsplumbConnection( mission, rule);});
    });

    // Add connections from Hotspot to Mission:
    $.each(hotspots, function(hotspot_index, hotspot) {
       $.each(hotspot.on_enter, function(rule_index, rule) {addJsplumbConnection( hotspot, rule);});
       $.each(hotspot.on_leave, function(rule_index, rule) {addJsplumbConnection( hotspot, rule);});
    });

}

// Fills the lists in the dialogs
// with the missions or hotspots
function initDialogLists(data) {
   $("#ruleDialog_nextMission").addOption("none", "[none]");
   $.each(data.missions, function(mission_index, mission) {
       $("#startMissionDialog_mission").addOption(mission.id, mission.name);
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