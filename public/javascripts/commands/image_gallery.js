/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
function DeleteImageCommand() {

    this.setParameter("command", "DeleteFileCommand");

    this.updateGui = function()  {

    }

    this.onSuccess = function() {
        $("#imageFileTree").jstree("refresh");
    }
}

DeleteImageCommand.prototype = new Command();


function MoveImageCommand() {
    this.setParameter("command", "MoveFileCommand");
    this.updateGui = function()  {}
}
MoveImageCommand.prototype = new Command();

function ImportImageCommand() {
    this.setParameter("command", "ImportFileCommand");
    this.updateGui = function()  {}
}
ImportImageCommand.prototype = new Command();
