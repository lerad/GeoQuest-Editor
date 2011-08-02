var mission_tree = null;

function deleteMission(missionId) {
    var really = confirm("Really delete mission with id \"" + missionId + "\"");
    if (!really) return;
    var cmd = new DeleteMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", missionId);
    cmd.execute();
}

function addMission(parentId, type) {

    var onSuccess = function(data) {
        if(!data.next_mission_id) {
            alert("Something has gone wrong");
            return;
        }
        // New Mission on the root layer:
        if(parentId == -1 || parentId == "-1") {
            var cmd = new AddMissionCommand();
            cmd.setParameter("project_id", project_id);
            cmd.setParameter("new_mission_id", data.next_mission_id);
            cmd.setParameter("new_mission_type", type);
            cmd.execute();
        }
        else { // Add Submission
            cmd = new AddSubmissionCommand();
            cmd.setParameter("project_id", project_id);
            cmd.setParameter("mission_id", parentId);
            cmd.setParameter("submission_id", data.next_mission_id);
            cmd.setParameter("submission_type", type);
            cmd.execute();
        }
    }

    // Query new mission id:

    $.ajax({
        url: "/ajax/get_next_mission_id",
        data : {
            "project_id" : project_id
        },
        success : onSuccess,
        error : function() {
            alert("Something has gone wrong");
        }
    });
}

function getNodeDataAsObject(node) {
    return eval(node.data("jstree"));
}

$(document).ready(function() {

var result = $.ajax({
    url : "/ajax/show_mission_types",
    dataType : 'json',
    async : false
});

var data = $.parseJSON(result.responseText);

$.jstree._themes = "/images/jstree/themes/";

  var mission_tree = $("#missionTree").jstree({
    "plugins" : ["themes", "json_data","contextmenu","crrm"],
    "core"  : {
      "animation" : 100
    },
    "json_data" : {
        "ajax" : {
        "url" : "/ajax/show_missions",
        "data" : function(n) {
          var mission_id = -1;
          if(n.data) {
            var nodeData = eval (n.data("jstree"));
            mission_id = nodeData.mission_id;
          }
          return {"project_id" : project_id, "mission_id" : mission_id};
        }
        }
    },
    "contextmenu" : {
    "items" : function(n) {
      var nodeData = getNodeDataAsObject(n);
      var items = {
      "ccp" : false,
      "create" : false,
      "remove" : false,
      "rename" : {
          "label" : "Rename Mission",
          "action" : function(n) {$("#missionTree").jstree("rename",n)}
      },
      "delete" : {
        "label" : "Delete Mission",
        "action" : function(n) {deleteMission(getNodeDataAsObject(n).mission_id); }
      },
      "add_mission" : {
        "label" : "Add Mission",
        "submenu" : {}
      }
    }

    for (var missionName in data) {
        var mission = data[missionName];
        var type = mission.name;
        items.add_mission.submenu[mission.name] = {
            "label" : mission.name,
            "action" : getAddMissionCallback(type)
        }
    }

    // Only allow submissions for these missions that support them
    if ((nodeData.type != "root") && (data[nodeData.type].has_submissions == false)) {
      items.add_mission = false;
    }

    return items;
    }

    }

  });

  mission_tree.bind("loaded.jstree", mark_current_mission);
  mission_tree.bind("refresh.jstree", mark_current_mission);

  mission_tree.bind("rename_node.jstree", function (e, data) {
    var name = data.rslt.name;


    var missionToRenamedId = getNodeDataAsObject(data.args[0]).mission_id;

    var cmd = new RenameMissionCommand();
    cmd.setParameter("name", name);
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", missionToRenamedId);
    cmd.execute();
});


});

function mark_current_mission() {
  if (mission_id) {
      var current_node = "#" + mission_id + "_missiontree";
      $(current_node).css("font-weight", "bold");
}
}

function getAddMissionCallback(type) {
  return function(n) { addMission(getNodeDataAsObject(n).mission_id, type); }
}
