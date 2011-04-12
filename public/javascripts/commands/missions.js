function AddSubmissionCommand() {

    this.setParameter("command", "AddSubmissionCommand");

    this.updateGui = function()  {
        // Reload after 1 sec
        setTimeout(function() {location.reload()}, 1000);
    }

}

AddSubmissionCommand.prototype = new Command();