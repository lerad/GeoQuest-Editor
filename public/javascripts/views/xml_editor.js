var codeMirror = null;

$(document).ready(function() {
   var options = {
     mode : "xml",
     lineNumbers : true
   };
   codeMirror = CodeMirror.fromTextArea(document.getElementById("xmleditor"), options);
});

function updateXmlFile() {
    var cmd = new UpdateXmlFileCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("xmlfile", codeMirror.getValue());
    cmd.execute();
}