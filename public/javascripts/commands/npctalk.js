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

        newRow.appendChild(tdSpeaker);
        newRow.appendChild(tdText);

    }
}

AddDialogEntryCommand.prototype = new Command();