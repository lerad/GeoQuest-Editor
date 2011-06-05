function UpdateXmlFileCommand() {

    this.setParameter("command", "UpdateXmlFileCommand");

    this.updateGui = function()  {
        // Do nothing. Probably later save it somewhere for a reset button.
    }
}

UpdateXmlFileCommand.prototype = new Command();
