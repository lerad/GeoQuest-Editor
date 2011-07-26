

function UpdateAttributeInMissionCommand() {

    this.setParameter("command", "UpdateAttributeInMission");

    this.updateGui = function()  {}
}

UpdateAttributeInMissionCommand.prototype = new Command();