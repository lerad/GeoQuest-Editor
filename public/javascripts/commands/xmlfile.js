function UpdateXmlFileCommand() {

    this.setParameter("command", "UpdateXmlFileCommand");

    this.updateGui = function()  {
        // Do nothing. Probably later save it somewhere for a reset button.
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
