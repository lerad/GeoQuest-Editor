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


    _this = this; // Save object, because onSuccess is not called on the object

    this.onSuccess = function() {
        from = _this.getParameter("event_holder");
        event = _this.getParameter("event");
        addJsplumbConnection(from, event);
    }
}

CreateNewEventCommand.prototype = new Command();