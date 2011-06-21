function AddSubmissionCommand() {

    this.setParameter("command", "AddSubmissionCommand");

    this.updateGui = function()  {
        // Reload after 200ms
        setTimeout(function() {
            if (mission_tree != null) {
               mission_tree.jstree("refresh");
            }
        }, 200);
    }

}

AddSubmissionCommand.prototype = new Command();

function AddMissionCommand() {

    this.setParameter("command", "AddMissionCommand");

    this.updateGui = function()  {
        // Reload after 200ms sec. Make nicer solution later
        setTimeout(function() {
            if (mission_tree != null) {
               mission_tree.jstree("refresh");
            }
        }, 200);
        // $("#missionTree").jstree.refresh();

    }

}

AddMissionCommand.prototype = new Command();