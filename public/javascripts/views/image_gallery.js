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
            "always_copy" : "multitree",
        "check_move" : function(m) {
                if(!m.np.data("jstree")) return false;
                if(m.np.data("jstree").type == "folder") return true;
                else return false;
            }
        }
    },
    "sort" : function(a,b) {


        if(!$(a).data("jstree")) return 1;
        if(!$(b).data("jstree")) return 1;

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
        "data" : {"project_id" : project_id, "path" : "drawable"}
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
       $("#imagePreview").attr("src","/projects/" + project_id + "/" + selected_file);
   }
   else {
       $("#targetFolder").val(selected_file);
       $("#imageUploadFolder").text("Folder: " + selected_file);
       $("#imagePreview").attr("src", "/images/empty.gif");
   }
});

$("#imageFileTree").bind("move_node.jstree", function(event, data) {
    /*
     * data.rslt.o: Object (In case of a copy: The new node)
     * data.rslt.np: New Parent
     */

    from = data.rslt.o.data("jstree").path;
    to = data.rslt.np.data("jstree").path + "/" + data.rslt.o.data("jstree").name
    data.rslt.o.data("jstree").path = to  // Save new path

    // Move in the same project
    if(data.rslt.o.data("jstree").project_id == project_id) {
        if(from != to) {
            cmd = new MoveImageCommand();
            cmd.setParameter("project_id", project_id);
            cmd.setParameter("from", from);
            cmd.setParameter("to", to);
            cmd.execute();
        }
    }
    // Copy from another project
    else {
        from_project_id = data.rslt.o.data("jstree").project_id;
        data.rslt.o.data("jstree").project_id = project_id; // Import
        cmd = new ImportImageCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("from", from);
        cmd.setParameter("from_project_id", from_project_id);
        cmd.setParameter("to", to);
        cmd.execute();
    }

});

$("#imageFileTree").bind("rename_node.jstree", function(event, data) {
    from = data.rslt.obj.data("jstree").path;
    to = data.rslt.obj.parents("li").data("jstree").path + "/" + data.rslt.name;

    // Update metadata:
    data.rslt.obj.data("jstree").path = to;
    data.rslt.obj.data("jstree").name = data.rslt.name;
    
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

$(document).ready(function() {
    $("#allProjectsImageFileTree").jstree({
    "plugins" : ["themes", "json_data", "dnd", "crrm", "ui", "sort"],
    "core"  : {
      "animation" : 100
    },
    "crrm" : {
        "move" : {
             "check_move" : function(m) {return false;} // Do not move in this tree
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
        "data" : {"no_project_id" : project_id}
        }
    }
});

    $("#allProjectsImageFileTree").bind("select_node.jstree", function(event, data) {
   selected_file = data.rslt.obj.data("jstree").path;
   selected_type = data.rslt.obj.data("jstree").type;
   selected_project_id = data.rslt.obj.data("jstree").project_id;

   if(selected_type == "file") {
       $("#imagePreview").attr("src","/projects/" + selected_project_id + "/" + selected_file);
   }
   else {
       $("#imagePreview").attr("src", "/images/empty.gif");
   }
});

});

function deleteImageFile(path) {

    $.ajax({
        url: "/ajax/is_image_used",
        data : {
            "project_id" : project_id,
            "image" : path
        },
        success : function(data) {
            if(data.length > 0) {
                text = "The image is used in at least one mission.\n" +
                       "Should it really be deleted?\n\n" +
                       "Missions:\n";
                for (var i=0; i < data.length; i++) {
                  text += data[i].name;
                  if(data[i].comment != "") text += " (" + data[i].comment + ")";
                  text += "\n";
                }
                var really = confirm(text);
                if (really) {
                    cmd = new DeleteImageCommand();
                    cmd.setParameter("project_id", project_id);
                    cmd.setParameter("path", path);
                    cmd.execute();
                }
            }
            // No usages, simply delete
            else {
                cmd = new DeleteImageCommand();
                cmd.setParameter("project_id", project_id);
                cmd.setParameter("path", path);
                cmd.execute();
            }
        },
        error : function() {
            alert("Something has gone wrong");
        }
    });


}