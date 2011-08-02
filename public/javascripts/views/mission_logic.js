
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
        var rule = null;
        try {
            rule = getRule("#ruleDialog_rule");
        } catch(msg) {
            alert("Error during rule creation: " + msg);
            return;
        }
        var holder = $("#ruleDialog_dialog").data("geoquest.holder");
        var holder_type = $("#ruleDialog_dialog").data("geoquest.holder_type");

        var type2property = {
            "onStart" : "on_start",
            "onEnd" : "on_end",
            "onLeave" : "on_leave",
            "onEnter" : "on_enter",
            "onTap" : "on_tap"

        };
        var prop_name = type2property[rule.type];
        if(holder[prop_name].length == 0) {
            rule.first_one = true;
        } else {
            rule.first_one = false;
        }
        holder[prop_name].push(rule) ;
        
        $.ajax({
           url: "/ajax/get_next_rule_id",
           data : {
               "project_id" : project_id
           },
           success : function(data) {
               rule.id = data.next_rule_id;
               var cmd = new CreateNewRuleCommand();
               cmd.setParameter("project_id", project_id);
               cmd.setParameter("rule", rule);
               cmd.setParameter("holder", holder);
               cmd.setParameter("holder_type", holder_type);
               cmd.execute();
           },
           error : function() {
               alert("Could not determine next rule id");
           }
       });




    });



});

$(document).ready(function() {
   $("#listRulesDialog_dialog").dialog({
      autoOpen: false,
      width: 700,
      height: 500,
      modal: true
   });

   createRuleDisplay("#listRulesDialog_rule");

    $("#listRulesDialog_updateButton").click(function() {
        try {
            var rule = getRule("#listRulesDialog_rule");
            rule.id = $("#listRulesDialog_rule").data("geoquest.rule_id");
            var cmd = new UpdateRuleCommand();
            cmd.setParameter("project_id", project_id);
            cmd.setParameter("rule", rule);
            cmd.execute();
        }
        catch(msg) {
            alert("Error during update: " + msg);
        }
    });

    $("#listRulesDialog_deleteButton").click(function() {
       var rule_id = $("#listRulesDialog_rule").data("geoquest.rule_id");
       var cmd = new DeleteRuleCommand();
       cmd.setParameter("project_id", project_id);
       cmd.setParameter("rule_id", rule_id);
       cmd.execute();
       
    });

});

$(document).ready(function() {

   createRuleDisplay("#editRuleDialog_rule");

    $("#editRuleDialog_dialog").dialog({
        autoOpen: false,
        width: 500,
        height: 500,
        modal: true
    });

    $("#editRuleDialog_updateButton").click(function() {
        try {
            var rule = getRule("#editRuleDialog_rule");
            var connection = $("#editRuleDialog_dialog").data("geoquest.connection");
            rule.id = connection.rule.id;
            $("#editRuleDialog_dialog").dialog("close");
            var cmd = new UpdateRuleCommand();
            cmd.setParameter("project_id", project_id);
            cmd.setParameter("rule", rule);
            cmd.setParameter("connection", connection);
            cmd.execute();
        } catch(msg) {
            alert("Error during update: " + msg);
        }
    });

    $("#editRuleDialog_deleteButton").click(function() {
       var connection = $("#editRuleDialog_dialog").data("geoquest.connection");
       $("#editRuleDialog_dialog").dialog("close");
       var cmd = new DeleteRuleCommand();
       cmd.setParameter("project_id", project_id);
       cmd.setParameter("rule_id", connection.rule.id);
       cmd.setParameter("connection", connection);
       cmd.execute();
    });

    
});

// Initialisation function of the dialog.
// It is called everytime the dialog is openened
function initRuleDialog(type, holder, holder_type) {
    $("#ruleDialog_dialog").data("geoquest.holder", holder);
    $("#ruleDialog_dialog").data("geoquest.holder_type", holder_type);
    initRuleDisplay("#ruleDialog_rule", type);
}




/*********************************
 * Other
 * (Ajax, Jsplump, Contextmenu)
 *********************************/

// from can be either a mission or a hotspot description. It only has to have an id
function addJsplumbConnection( from, rule) {

  // Not all rules are a Mission call:
  if(rule.next_mission == null) return;

  var edgeLabel = rule.type;
  if($.trim(rule.condition_text) != "") {
      edgeLabel = rule.condition_text;
  }

  var style = {
    lineWidth: 3,
    strokeStyle: "black"
  };

  var hoverStyle = {
    lineWidth: 6,
    strokeStyle: "blue"
  };

  var my_overlays = [[ "Arrow", {location:0.9} ], [ "Label", { label: edgeLabel, cssClass: "graph-label", location:0.5 } ]
];

  var anchors = ["TopLeft", "TopCenter", "TopRight", "LeftMiddle", "RightMiddle",
             "BottomLeft", "BottomCenter", "BottomRight"];

  var connection = jsPlumb.connect({
      source: (from.id + "-box"),
      target: (rule.next_mission + "-box"),
      paintStyle: style,
      hoverPaintStyle: hoverStyle,
      overlays: my_overlays,
      endpoint: ["Dot", {radius: 1}],
//      label: rule.type,
      connector: ["Bezier", {curviness: 30}],
      dynamicAnchors: anchors,
      labelStyle : {fillStyle:"rgba(255,255,255, 0.8)", color:"black",borderWidth:10}

} );
    connection.rule = rule;
    connection.gq_from = from;
    connection.bind('click', openEditRuleDialog);

}



function openEditRuleDialog(con) {

    $.ajax({
        url : '/ajax/show_rule',
        data : {
            "project_id" : project_id,
            "rule_id" : con.rule.id
        },
        success : function(data) {
            data.type = con.rule.type;
            loadRuleDisplay("#editRuleDialog_rule", data);
            var title = "Edit " + con.rule.type + " rule in " + con.gq_from.name;
            $("#editRuleDialog_dialog").data("geoquest.connection", con);
            $("#editRuleDialog_dialog").dialog("option", "title", title)
                                       .dialog("open");
        },
        error : function() {
            alert("Could not load rule with id " + con.rule.id);
        }
    });
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

    initRuleDisplay("#listRulesDialog_rule", null);

    var title = "Edit rules of " + element.data("geoquest.object").name;
    if($("#listRulesDialog_rulesTree").jstree != null) {
        $("#listRulesDialog_rulesTree").jstree('destroy');
    }

    $("#listRulesDialog_rulesTree").jstree({
      "plugins" : ["themes", "json_data", "ui"],
      "core"  : {
        "animation" : 100
        },
      "json_data" : {
        "ajax" : {
        "url" : "/ajax/show_mission_rules_as_tree",
        "data" : {
          "mission_id" : element.data("geoquest.object").id,
          "project_id" : project_id
          }
        }
    }
    });

    $("#listRulesDialog_rulesTree").bind("select_node.jstree", function (e, data) {
          var rule_id = data.rslt.obj.data("jstree").rule_id;
          var rule_type = data.rslt.obj.data("jstree").rule_type;
          
          $("#listRulesDialog_rule").data("geoquest.rule_id", rule_id);

          $.ajax({
                url : '/ajax/show_rule',
                data : {
                    "project_id" : project_id,
                    "rule_id" : rule_id
                },
                success : function(data) {
                    data.type = rule_type;
                    loadRuleDisplay("#listRulesDialog_rule", data);
                },
                error : function() {
                    alert("Could not load rule with id " + con.rule.id);
                }
            });

    });



    
    $("#listRulesDialog_dialog").dialog("option", "title", title)
                        .dialog("open");
    
}

function contextMenuCallback(action, element, pos) {
    var actionMapping = {
        "addOnEnd" : "onEnd",
        "addOnStart" : "onStart",
        "addOnTap" : "onTap",
        "addOnLeave" : "onLeave",
        "addOnEnter" : "onEnter"
    };

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

    var missions = data.missions;
    var hotspots = data.hotspots;

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
       $(".content").append(element);
       jsPlumb.draggable(element);
       element.bind("dragstop", function(rule, ui) {
        var cmd = new MoveMissionVisualizationCommand();
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
          var cmd = new MoveHotspotVisualizationCommand();
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
       $.each(hotspot.on_tap, function(rule_index, rule) {addJsplumbConnection( hotspot, rule);});

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
