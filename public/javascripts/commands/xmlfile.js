/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
function UpdateXmlFileCommand() {

    this.setParameter("command", "UpdateXmlFileCommand");

    this.updateGui = function()  {
        $("#messageField").removeClass("failure")
                          .removeClass("success")
                          .text("Saving...");
    }

    this.onSuccess = function() {

        $("#messageField").removeClass("failure")
                          .addClass("success")
                          .text("xml file saved");
    }

    this.onFailure = function() {
        $("#messageField").removeClass("success")
                          .addClass("failure")
                          .text("error during saving");
    }
}

UpdateXmlFileCommand.prototype = new Command();
