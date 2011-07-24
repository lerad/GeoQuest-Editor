// Initialize FileTree:
$(document).ready(function() {

$.jstree._themes = "/images/jstree/themes/";

  $("#imageFileTree").jstree({
    "plugins" : ["themes", "json_data","contextmenu","crrm","dnd", "ui", "sort"],
    "core"  : {
      "animation" : 100
    },
    "crrm" : {
        "move" : {
        "check_move" : function(m) {
                if(!m.np.data("jstree")) return false;
                if(m.np.data("jstree").type == "folder") return true;
                else return false;
            }
        }
    },
    "sort" : function(a,b) {
        // Folder first:
        type_a = $(a).data("jstree").type;
        type_b = $(b).data("jstree").type;
        name_a = $(a).data("jstree").name;
        name_b = $(b).data("jstree").name;
        if(type_a == "folder" && type_b == "file") return -1;
        if(type_a == "file" && type_b == "folder") return 1;
        if(name_a < name_b) return -1;
        else return 1;
    },
    "json_data" : {
        "ajax" : {
        "url" : "/ajax/show_images",
        "data" : function(n) {
          path = "/drawable";
          if(n.data) {
              var nodeData = eval (n.data("jstree"));
              path = nodeData.path;
          }
          return {"project_id" : project_id, "path" : path};
        }
        }
    },
    "contextmenu" : {
        "items" : {
        "ccp" : false,
        "create" : false,
        "remove" : false,
        "delete" : {
            "label" : "Delete",
            "action" : function(n) {
                deleteImageFile(n.data("jstree").path);
                }

            }
        }
    }
    });
    
$("#imageFileTree").bind("select_node.jstree", function(event, data) {
   selected_file = data.rslt.obj.data("jstree").path;
   selected_type = data.rslt.obj.data("jstree").type;
   if(selected_type == "file") {
       $("#imagePreview").attr("src","/projects/" + project_id + selected_file);
   }
   else {
       $("#targetFolder").val(selected_file);
       $("#imageUploadFolder").text("Folder: " + selected_file);
       $("#imagePreview").attr("src", "/images/empty.gif");
   }
});

$("#imageFileTree").bind("move_node.jstree", function(event, data) {
    /*
     * data.rslt.o: Object
     * data.rslt.np: New Parent
     */
    from = data.rslt.o.data("jstree").path;
    to = data.rslt.np.data("jstree").path + "/" + data.rslt.o.data("jstree").name
    data.rslt.o.data("jstree").path = to  // Save new path
    if(from != to) {
      cmd = new MoveImageCommand();
      cmd.setParameter("project_id", project_id);
      cmd.setParameter("from", from);
      cmd.setParameter("to", to);
      cmd.execute();
  }

});

$("#imageFileTree").bind("rename_node.jstree", function(event, data) {
    from = data.rslt.obj.data("jstree").path;
    to = data.rslt.obj.parents("li").data("jstree").path + "/" + data.rslt.name;

    cmd = new MoveImageCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("from", from);
    cmd.setParameter("to", to);
    cmd.execute();
});


});


// Image Actions

$(document).ready(function() {
 $("#imageActions").accordion();
});


function deleteImageFile(path) {
    //TODO: Usage search with AJAX
    cmd = new DeleteImageCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("path", path);
    cmd.execute();
}