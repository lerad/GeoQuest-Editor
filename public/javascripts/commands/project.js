function ChangeProjectNameCommand() {
    this.setParameter("command", "ChangeProjectNameCommand");

    this.updateGui = function()  {
        $("#caption").text(this.getParameter("name"));
    }

}

ChangeProjectNameCommand.prototype = new Command();