// Initialize FileTree:
$(document).ready(function() {

$.jstree._themes = "/images/jstree/themes/";

  $("#imageFileTree").jstree({
    "plugins" : ["themes", "json_data","contextmenu","crrm","dnd", "ui"],
    "core"  : {
      "animation" : 100
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