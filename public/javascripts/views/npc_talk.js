/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */

function addDialogEntry() {
  var cmd = new AddDialogEntryCommand();
  cmd.setParameter("speaker", document.getElementById('speaker').value);
  cmd.setParameter("text", document.getElementById('text').value);
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

// Parameter button = Button from which the event is sent
function deleteDialogEntry(button) {
  var td = button.parentNode; // Cell to which the button belongs
  var tr = td.parentNode; // Row to which the button belongs
  var index = tr.rowIndex;

  // Note to the index:
  // JavaScript starts at 0, XQuery at 1
  // because we will never need to modify the first row (because it is the header)
  // And the second row equals to the first row in the database, we do not
  // need to modify the index, when we pass it from Javascript to XQuery

  var cmd = new DeleteDialogEntryCommand();
  cmd.setParameter("index", index);
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

function moveRowUp(button) {
  var td = button.parentNode; // Cell to which the button belongs
  var tr = td.parentNode; // Row to which the button belongs
  var index = tr.rowIndex;

  if(index == 1)
    return; // Row is at the top

  var cmd = new MoveDialogEntryUpCommand();
  cmd.setParameter("index", index);
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

function moveRowDown(button) {
  var td = button.parentNode; // Cell to which the button belongs
  var tr = td.parentNode; // Row to which the button belongs
  var index = tr.rowIndex;
  var table = document.getElementById('npcTalkTable');
  // -1 because javascript starts at 0 with counting
  // -1 because the last row contains the form for adding new entries
  var lastIndex = table.rows.length-2;

  if(index == lastIndex)
    return; // Row is at the bottom

  var cmd = new MoveDialogEntryDownCommand();
  cmd.setParameter("index", index);
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

function changeCharImage(file) {
  var cmd = new ChangeCharImageCommand();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.setParameter("image", file);
  cmd.execute();
}

var imageSelector = new ImageSelector(changeCharImage);

$(document).ready(function() {
    $("#changeCharacterImageButton").click(function() {
        imageSelector.show();
    });
});