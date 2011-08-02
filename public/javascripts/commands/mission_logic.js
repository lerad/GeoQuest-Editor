/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
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

function CreateNewRuleCommand() {
    this.setParameter("command", "CreateNewRuleCommand");

    this.updateGui = function() {
    }


    var _this = this; // Save object, because onSuccess is not called on the object

    this.onSuccess = function() {
        var rule = _this.getParameter("rule");
        var from = _this.getParameter("holder");
        addJsplumbConnection(from, rule);
    }
}

CreateNewRuleCommand.prototype = new Command();




function UpdateRuleCommand() {
    this.setParameter("command", "UpdateRuleCommand");

    this.updateGui = function() {
    }


    var _this = this; // Save object, because onSuccess is not called on the object

    this.preExecute = function() {
        _this.connection = _this.getParameter("connection");
        _this.setParameter("connection", "");   // This is not needed to send over the net
    }

    this.onSuccess = function() {
        var rule = _this.getParameter("rule");
        var connection = _this.connection;
        if(connection != null) {
            var from = connection.gq_from;
            jsPlumb.detach(connection.sourceId, connection.targetId);
            addJsplumbConnection(from, rule);
        }
    }
}

UpdateRuleCommand.prototype = new Command();


/*
 * TODO: The connection should be totally removed from this commands
 */

function DeleteRuleCommand() {
    this.setParameter("command", "DeleteRuleCommand");

    this.updateGui = function() {
    }


    var _this = this; // Save object, because onSuccess is not called on the object

    this.preExecute = function() {
        _this.connection = _this.getParameter("connection");
        _this.setParameter("connection", "");   // This is not needed to send over the net
    }

    this.onSuccess = function() {
        var connection = _this.connection;
        if(connection != null) {
            jsPlumb.detach(connection.sourceId, connection.targetId);
        }
        if($("#listRulesDialog_rulesTree").jstree) {
            $("#listRulesDialog_rulesTree").jstree('refresh');
        }
    }
}

DeleteRuleCommand.prototype = new Command();