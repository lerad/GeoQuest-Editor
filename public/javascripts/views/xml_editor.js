$(document).ready(function() {
   var options = {
     mode : "xml",
     lineNumbers : true
   };
   CodeMirror.fromTextArea(document.getElementById("xmleditor"), options);
});