function MoveMissionVisualizationCommand() {

    this.setParameter("command", "MoveMissionVisualizationCommand");

    this.updateGui = function()  {

    }
}

MoveMissionVisualizationCommand.prototype = new Command();


function MoveHotspotVisualizationCommand() {

    this.setParameter("command", "MoveHotspotVisualizationCommand");

    this.updateGui = function()  {

    }
}

MoveHotspotVisualizationCommand.prototype = new Command();


function CreateNewEventCommand() {
    this.setParameter("command", "CreateNewEventCommand");

    this.updateGui = function() {
    }
}

CreateNewEventCommand.prototype = new Command();