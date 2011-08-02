/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */



// New image should be specified as parameter "image"
function UpdateStartScreenImageCommand() {

    // As this command does not need specific Xml commands
    // UpdateAttributeInMission is a generic Command
    this.setParameter("command", "UpdateAttributeInMission");
    this.setParameter("attribute", "image");

    this.updateGui = function()  {
        var image = "/projects/" + this.getParameter("project_id") + "/" + this.getParameter("image");
        $("#startScreenImage").attr("src", image);
    }

    this.preExecute = function() {
        this.setParameter("value", this.getParameter("image"));
    }
}

UpdateStartScreenImageCommand.prototype = new Command();

