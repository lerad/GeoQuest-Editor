/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
function AddHotspotCommand() {

    this.setParameter("command", "AddHotspotCommand");

    this.updateGui = function()  {
        // Actualize GUI
        // addMarker is defined in Map.js
        addMarker(this.parameter["latitude"], this.parameter["longitude"], this.parameter["id"], 30, "");
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
        marker.circle.setMap(null);
        marker.setMap(null);
    }
}

DeleteHotspotCommand.prototype = new Command();


/**
 * Expects: image, radius, hotspot_id
 */
function UpdateHotspotCommand() {
    this.setParameter("command", "UpdateHotspotCommand");

    this.updateGui = function() {
        var marker = getMarker(this.getParameter("hotspot_id"));
        marker.circle.setRadius(parseInt(this.getParameter("radius")));
        marker.setIcon("/projects/" + this.getParameter("project_id") + "/" + this.getParameter("image"));
    }
}

UpdateHotspotCommand.prototype = new Command();