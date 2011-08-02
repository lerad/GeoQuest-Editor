/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
function AddSubmissionCommand() {

    this.setParameter("command", "AddSubmissionCommand");

    this.updateGui = function()  {

    }

    this.onSuccess = function() {
         $("#missionTree").jstree("refresh");
    }

}

AddSubmissionCommand.prototype = new Command();

function AddMissionCommand() {

    this.setParameter("command", "AddMissionCommand");

    this.updateGui = function()  {
    }

    this.onSuccess = function() {
        $("#missionTree").jstree("refresh");
    }

}

AddMissionCommand.prototype = new Command();


function DeleteMissionCommand() {

    this.setParameter("command", "DeleteMissionCommand");

    this.updateGui = function() {
        
    }

    this.onSuccess = function() {
        $("#missionTree").jstree("refresh");
    }

}

DeleteMissionCommand.prototype = new Command();




function RenameMissionCommand() {

    this.setParameter("command", "UpdateAttributeInMission");
    this.setParameter("attribute", "name");

    this.updateGui = function() {

    }

    this.preExecute = function() {
        this.setParameter("value", this.getParameter("name"));
    }
}



RenameMissionCommand.prototype = new Command();