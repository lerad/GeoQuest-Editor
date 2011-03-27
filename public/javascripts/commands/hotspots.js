function AddHotspotCommand() {

    this.setParameter("command", "AddHotspotCommand");

    this.execute = function()  {
        // Actualize GUI
        // addMarker is defined in Map.js
        addMarker(this.parameter["latitude"], this.parameter["longitude"], this.parameter["id"]);

        this.makeAjaxCall();
    }
}

AddHotspotCommand.prototype = new Command();

function MoveHotspotCommand() {
    this.setParameter("command", "MoveHotspotCommand");

    this.execute = function()  {
        // Actualization of the GUI is not needed, because the marker are
        // draggable my default. Thus the Google-Maps-API does this.

        this.makeAjaxCall();
    }
}

MoveHotspotCommand.prototype = new Command();