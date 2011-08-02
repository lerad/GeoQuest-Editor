/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
function ChangeProjectNameCommand() {
    this.setParameter("command", "ChangeProjectNameCommand");

    this.updateGui = function()  {
        $("#caption").text(this.getParameter("name"));
    }

}

ChangeProjectNameCommand.prototype = new Command();