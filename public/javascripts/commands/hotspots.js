function AddHotspotCommand() {

    this.setParameter("command", "AddHotspotCommand");

    this.updateGui = function()  {
        // Actualize GUI
        // addMarker is defined in Map.js
        addMarker(this.parameter["latitude"], this.parameter["longitude"], this.parameter["id"]);
    }
}

AddHotspotCommand.prototype = new Command();

function MoveHotspotCommand() {
    this.setParameter("command", "MoveHotspotCommand");

    this.updateGui = function()  {
        // Actualization of the GUI is not needed, because the marker are
        // draggable my default. Thus the Google-Maps-API does this.
    }
}

MoveHotspotCommand.prototype = new Command();

function DeleteHotspotCommand() {
    this.setParameter("command", "DeleteHotspotCommand");

    this.updateGui = function() {
        var marker = getMarker(this.getParameter("id"));
        marker.setMap(null);
    }
}

DeleteHotspotCommand.prototype = new Command();