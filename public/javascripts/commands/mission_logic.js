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


function CreateNewRuleCommand() {
    this.setParameter("command", "CreateNewRuleCommand");

    this.updateGui = function() {
    }


    _this = this; // Save object, because onSuccess is not called on the object

    this.onSuccess = function() {
        rule = _this.getParameter("rule");
        from = _this.getParameter("holder");
        addJsplumbConnection(from, rule);
    }
}

CreateNewRuleCommand.prototype = new Command();




function UpdateRuleCommand() {
    this.setParameter("command", "UpdateRuleCommand");

    this.updateGui = function() {
    }


    _this = this; // Save object, because onSuccess is not called on the object

    this.preExecute = function() {
        _this.connection = _this.getParameter("connection");
        _this.setParameter("connection", "");   // This is not needed to send over the net
    }

    this.onSuccess = function() {
        rule = _this.getParameter("rule");
        connection = _this.connection;
        from = connection.gq_from;
        jsPlumb.detach(connection.sourceId, connection.targetId);
        addJsplumbConnection(from, rule);
    }
}

UpdateRuleCommand.prototype = new Command();