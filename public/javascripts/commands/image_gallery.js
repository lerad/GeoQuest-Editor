function DeleteImageCommand() {

    this.setParameter("command", "DeleteFileCommand");

    this.updateGui = function()  {

    }

    this.onSuccess = function() {
        $("#imageFileTree").jstree("refresh");
    }
}

DeleteImageCommand.prototype = new Command();


function MoveImageCommand() {

    this.setParameter("command", "MoveImageCommand");

    this.updateGui = function()  {

    }

}

MoveImageCommand.prototype = new Command();
