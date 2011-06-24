
var map;
var markerList = new Array();

// This is needed to convert a Point to a LatLng...
var overlay = new google.maps.OverlayView();
overlay.draw = function() {};

var hotspotRadiusDialogHtml = 'Radius (m): <input id="hotspotRadius" type="text" size="4" /><br /> \
                               <input type="button" id="changeRadiusButton" value="Ok" />'

var hotspotRadiusDialog = null;

var imageSelector = new ImageSelector(null);


function initializeMap() {
    // Address of the university building at the "Römerstraße" in Bonn
    var latlng = new google.maps.LatLng(50.718437, 7.118864);
    var myOptions = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.SATELLITE
     
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    overlay.setMap(map);
}

    

function initializeRadiusDialog() {


    hotspotRadiusDialog = $('<div></div>')
    .html(hotspotRadiusDialogHtml)
    .dialog({
        autoOpen: false,
        title: 'Radius',
        width: 300

    });

    $("#changeRadiusButton").click(function() {
        hotspotRadiusDialog.dialog('close');
        var cmd = new UpdateHotspotCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("mission_id", mission_id);
        cmd.setParameter("hotspot_id", hotspotRadiusDialog.marker.hotspot_id);
        cmd.setParameter("radius", $("#hotspotRadius").attr("value"));
        cmd.setParameter("image", hotspotRadiusDialog.marker.customIcon);
        cmd.execute();
    });

}



function initializeMapContextMenu() {
    $("#map_canvas").contextMenu({
        menu: 'mapMenu'
    },
    function(action, el, pos) {
        if (action == "newHotspot") createHotspot(pos);
    });
}


$(document).ready(function() {
    initializeMap();
    addHotspotMarkerToMap();
    initializeRadiusDialog();
    initializeMapContextMenu();
});

/**
 * Adds a contextmenu to a marker
 * The markers div element is found via the path of the markers image
 * E.g. The image tag with the image /images/marker1.png
 * As these are not necessarily unique, an ID should be added to the path
 * E.g. /images/marker1.png#hotspot1
 */
function initializeMarkerContextMenu(marker, imagePath) {
        $("img[src=\"" + imagePath + "\"]").parent().contextMenu(
        {
            menu: 'hotspotMenu'
        },
        function(action, el, pos) {
            if (action == "deleteHotspot") {
                var cmd = new DeleteHotspotCommand();
                cmd.setParameter("id", marker.hotspot_id);
                cmd.setParameter("project_id", project_id);
                cmd.setParameter("mission_id", mission_id);
                cmd.execute();
            }
            else if (action == "changeImage") {
                // Remove existing initiation, so only one is always open
                // Otherwise it might lead to problems with the ids.
                imageSelector.setCallback(function(file) {
                    marker.customIcon = file;
                    var cmd = new UpdateHotspotCommand();
                    cmd.setParameter("project_id", project_id);
                    cmd.setParameter("mission_id", mission_id);
                    cmd.setParameter("hotspot_id", marker.hotspot_id);
                    cmd.setParameter("radius", marker.circle.radius);
                    cmd.setParameter("image", file);
                    cmd.execute();
                });
                imageSelector.show();
            }
            else if (action == "changeRadius") {
                $("#hotspotRadius").attr("value", marker.radius);
                hotspotRadiusDialog.marker = marker;
                hotspotRadiusDialog.dialog("open");
            }
        });


}

function addMarker(lat, lng, hotspot_id, _radius, image) {

    if(markerList[hotspot_id] != null) {
        alert("Error: Duplicate name: " + hotspot_id);
        return;
    }


    /**
     * Add marker to map
     */
    var myLatlng = new google.maps.LatLng(lat,lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: hotspot_id,
        draggable: true
    });


    /**
     * Save some variables
     */

    marker.customIcon = image;
    marker.hotspot_id = hotspot_id;
    marker.radius = _radius;
    markerList[hotspot_id] = marker;

    /**
     * Set the icon
     * The postfix "#<id>" is added to find the element later
     */
    var path = "";

    if(image == "") { 
        // Use default icon. This is done explicitely, so the id can be included
        path = "http://www.google.com/mapfiles/marker.png#" + hotspot_id;
    }
    else {
        path = "/projects/" + project_id + "/" + image + "#" + hotspot_id; 
    }

    marker.setIcon(path);

    /**
     * Add a circle to the marker
     */
    var circle = new google.maps.Circle({
        map: map,
        radius: _radius
    });

    circle.bindTo('center', marker, 'position');

    marker.circle = circle;


    // It seems as if the image is not added directly. Thus a little time
    // must pass until the contextmenu gets added, otherwise the element is not
    // found
    setTimeout(function() { initializeMarkerContextMenu(marker, path); }, 1000);
    

    /**
     * Add events
     */
    google.maps.event.addListener(marker, "dragend", function() {
        var cmd = new MoveHotspotCommand();
        cmd.setParameter("id", marker.getTitle());
        cmd.setParameter("latitude", marker.getPosition().lat());
        cmd.setParameter("longitude", marker.getPosition().lng());
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("mission_id", mission_id);
        cmd.execute();
    });

}

function getMarker(id) {
    return markerList[id];
}

function createHotspot(pos) {
    point = new google.maps.Point(pos.x, pos.y);
    latlng = overlay.getProjection().fromContainerPixelToLatLng(point);

    // Query new hotspot id:

    $.ajax({
        url: "/ajax/get_next_hotspot_id",
        data : {
            "project_id" : project_id
        },
        success : function(data) {
            var cmd = new AddHotspotCommand();
            cmd.setParameter("latitude", latlng.lat());
            cmd.setParameter("longitude", latlng.lng());
            cmd.setParameter("id", data.next_hotspot_id);
            cmd.setParameter("mission_id", mission_id);
            cmd.setParameter("project_id", project_id);
            cmd.execute();
        },
        error : function() {
            alert("Something has gone wrong");
        }
    });


}


