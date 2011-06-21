function AddSubmissionCommand() {

    this.setParameter("command", "AddSubmissionCommand");

    this.updateGui = function()  {

    }

    this.onSuccess = function() {
      if (mission_tree != null) {
               mission_tree.jstree("refresh");
      }
    }

}

AddSubmissionCommand.prototype = new Command();

function AddMissionCommand() {

    this.setParameter("command", "AddMissionCommand");

    this.updateGui = function()  {
    }

    this.onSuccess = function() {
      if (mission_tree != null) {
               mission_tree.jstree("refresh");
      }
    }

}

AddMissionCommand.prototype = new Command();


function DeleteMissionCommand() {

    this.setParameter("command", "DeleteMissionCommand");

    this.updateGui = function() {
        
    }

    this.onSuccess = function() {
      if (mission_tree != null) {
               mission_tree.jstree("refresh");
      }
    }

}

DeleteMissionCommand.prototype = new Command();