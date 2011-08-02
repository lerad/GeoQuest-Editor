/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
function SetWebPageUrlCommand() {

    // As this command does not need specific Xml commands
    // UpdateAttributeInMission is a generic Command
    this.setParameter("command", "UpdateAttributeInMission");
    this.setParameter("attribute", "url");

    this.updateGui = function()  {   }

    this.preExecute = function() {
        this.setParameter("value", this.getParameter("url"));
    }
}

SetWebPageUrlCommand.prototype = new Command();


function SetWebPageButtonTextCommand() {

    // As this command does not need specific Xml commands
    // UpdateAttributeInMission is a generic Command
    this.setParameter("command", "UpdateAttributeInMission");
    this.setParameter("attribute", "buttontext");

    this.updateGui = function()  {   }

    this.preExecute = function() {
        this.setParameter("value", this.getParameter("button_text"));
    }
}

SetWebPageButtonTextCommand.prototype = new Command();

function SetWebPageFileCommand() {

    // As this command does not need specific Xml commands
    // UpdateAttributeInMission is a generic Command
    this.setParameter("command", "UpdateAttributeInMission");
    this.setParameter("attribute", "file");

    this.updateGui = function()  {   }

    this.preExecute = function() {
        this.setParameter("value", this.getParameter("file"));
    }
}

SetWebPageFileCommand.prototype = new Command();


