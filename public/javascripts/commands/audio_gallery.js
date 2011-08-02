/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */

function DeleteAudioCommand() {

    this.setParameter("command", "DeleteFileCommand");

    this.updateGui = function()  {

    }

    this.onSuccess = function() {
        $("#audioFileTree").jstree("refresh");
    }
}

DeleteAudioCommand.prototype = new Command();


function MoveAudioCommand() {
    this.setParameter("command", "MoveFileCommand");
    this.updateGui = function()  {}
}
MoveAudioCommand.prototype = new Command();

function ImportAudioCommand() {
    this.setParameter("command", "ImportFileCommand");
    this.updateGui = function()  {}
}
ImportAudioCommand.prototype = new Command();
