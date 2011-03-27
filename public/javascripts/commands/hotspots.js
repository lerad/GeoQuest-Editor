function AddHotspotCommand() {

    this.type = "AddHotspotCommand";
    this.parameter = new Object();

    this.setParameter = function(name, value) {
        this.parameter[name] = value;
    }

    this.execute = function()  {
        // Actualize GUI
        // addMarker is defined in Map.js
        addMarker(this.parameter["latitude"], this.parameter["longitude"], this.parameter["id"]);

        // Do Ajax call:
        jQuery.post("/hotspots/create",
                    "id=" + this.parameter["id"] +
                    "&latitude=" + this.parameter["latitude"] +
                    "&longitude=" + this.parameter["longitude"] +
                    "&project=" + this.parameter["project"]
                    );

    }
}

function MoveHotspotCommand() {
    this.type = "MoveHotspotCommand";
    this.parameter = new Object();

    this.setParameter = function(name, value) {
        this.parameter[name] = value;
    }

    this.execute = function()  {
        // Actualization of the GUI is not needed, because the marker are
        // draggable my default. Thus the Google-Maps-API does this.

        // Do Ajax call:
        jQuery.post("/hotspots/update",
            "id=" + this.parameter["id"] +
            "&latitude=" + this.parameter["latitude"] +
            "&longitude=" + this.parameter["longitude"] +
            "&project=" + this.parameter["project"]
            );


    }

}

