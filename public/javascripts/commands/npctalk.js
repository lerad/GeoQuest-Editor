function AddDialogEntryCommand() {

    this.setParameter("command", "AddDialogEntryCommand");

    this.updateGui = function()  {
        var table = document.getElementById('npcTalkTable');
        var numRows = table.rows.length;

        // Insert a new row at the penultimate row
        // (the last row is where the text-fields for the new Entry is in)
        var newRow = table.insertRow(numRows -1);

        var tdSpeaker = document.createElement("td");
        tdSpeaker.className = "npcTalkCell npcTalkSpeakerCell";
        var tdSpeakerText = document.createTextNode(this.getParameter("speaker"));
        tdSpeaker.appendChild(tdSpeakerText);
        var tdText = document.createElement("td");
        tdText.className = "npcTalkCell";
        var tdTextText = document.createTextNode(this.getParameter("text"));
        tdText.appendChild(tdTextText);

        var tdRemove = $(document.createElement("td"))
                       .attr("class", "npcTalkCell")
                       .append($(document.createElement("input"))
                              .attr("type", "image")
                              .attr("src", "/images/delete.png")
                              .attr("value", "X")
                              .attr("onclick", "deleteDialogEntry(this)")
                            );

        var tdUp = $(document.createElement("td"))
                       .attr("class", "npcTalkCell")
                       .append($(document.createElement("input"))
                              .attr("type", "image")
                              .attr("src", "/images/up.png")
                              .attr("value", "^")
                              .attr("onclick", "moveRowUp(this)")
                            );

        var tdDown = $(document.createElement("td"))
                       .attr("class", "npcTalkCell")
                       .append($(document.createElement("input"))
                              .attr("type", "image")
                              .attr("src", "/images/down.png")
                              .attr("value", "v")
                              .attr("onclick", "moveRowDown(this)")
                            );

        newRow.appendChild(tdSpeaker);
        newRow.appendChild(tdText);
        $(newRow).append(tdRemove);
        $(newRow).append(tdUp);
        $(newRow).append(tdDown);


    }
}

AddDialogEntryCommand.prototype = new Command();

function DeleteDialogEntryCommand() {

    this.setParameter("command", "DeleteDialogEntryCommand");

    this.updateGui = function()  {
        var table = document.getElementById('npcTalkTable');
        table.deleteRow(this.getParameter("index"));
    }
}

DeleteDialogEntryCommand.prototype = new Command();

function MoveDialogEntryUpCommand() {
    this.setParameter("command", "MoveDialogEntryUpCommand");

    this.updateGui = function()  {
        var index = this.getParameter('index');
        // Descendant Selector:
        // http://www.w3.org/TR/CSS2/selector.html#descendant-selectors
        var row = $("#npcTalkTable tr").eq(index);
        row.insertBefore(row.prev());
    }
}

MoveDialogEntryUpCommand.prototype = new Command();


function MoveDialogEntryDownCommand() {
    this.setParameter("command", "MoveDialogEntryDownCommand");

    this.updateGui = function()  {
        var index = this.getParameter('index');
        var row = $("#npcTalkTable tr").eq(index);
        row.insertAfter(row.next());
    }
}

MoveDialogEntryDownCommand.prototype = new Command();


// New image should be specified as parameter "image"
function ChangeCharImageCommand() {

    // As this command does not need specific Xml commands
    // UpdateAttributeInMission is a generic Command
    this.setParameter("command", "UpdateAttributeInMission");
    this.setParameter("attribute", "charImage");

    this.updateGui = function()  {
        var image = "/projects/" + this.getParameter("project_id") + "/" + this.getParameter("image");
        $("#charImage").attr("src", image);
    }

    this.preExecute = function() {
        this.setParameter("value", this.getParameter("image"));
    }
}

ChangeCharImageCommand.prototype = new Command();