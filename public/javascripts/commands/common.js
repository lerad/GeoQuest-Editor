/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */


function UpdateAttributeInMissionCommand() {

    this.setParameter("command", "UpdateAttributeInMission");

    this.updateGui = function()  {}
}

UpdateAttributeInMissionCommand.prototype = new Command();