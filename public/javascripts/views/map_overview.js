
var map;
var hotspotCreating = false;
var hotspotDeleting = false;
var markerList = new Array();

// This is needed to convert a Point to a LatLng...
var overlay = new google.maps.OverlayView();
overlay.draw = function() {};


function onMapClick(event) {

    if (hotspotCreating) {
        var id = prompt("Marker id");

        if(markerList[id] != null) {
            alert("Id is already given to another hotspot");
            return;
        }

        var lng = event.latLng.lng();
        var lat = event.latLng.lat();

        hotspotCreating = false;

        var cmd = new AddHotspotCommand();
        cmd.setParameter("latitude", lat);
        cmd.setParameter("longitude", lng);
        cmd.setParameter("id", id);
        cmd.setParameter("mission_id", mission_id);
        cmd.setParameter("project_id", project_id);
        cmd.execute();
    }
}


// this is called when the page loads.
// it initializes the map, and creates each marker
function initialize() {
    var latlng = new google.maps.LatLng(50.718437, 7.118864);
    var myOptions = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.SATELLITE
     
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    google.maps.event.addListener(map, "click", onMapClick);
    overlay.setMap(map);

    addHotspotMarker();

}

function createNewHotspot() {
    hotspotCreating = true;
    hotspotDeleting = false; // If it is still active
}

function deleteHotspot() {
    hotspotCreating = false;
    hotspotDeleting = true; 
}


var hotspotRadiusDialogHtml = 'Radius (m): <input id="hotspotRadius" type="text" size="4" /><br /> \
                               <input type="button" id="changeRadiusButton" value="Ok" />'

var selectedMarker = null;
var selectedImage = "";
var hotspotRadiusDialog = $('<div></div>')
.html(hotspotRadiusDialogHtml)
.dialog({
    autoOpen: false,
    title: 'Radius',
    width: 300

});

var imageSelector = new ImageSelector(null);


function changeHotspotImage(file) {
    $("#hotspotImage").attr("src", "/projects/" + project_id + "/" + file);
    selectedImage = file;
}

$(document).ready(function() {
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


});



function openHotspotDialog(marker) {
    selectedMarker = marker;
    selectedImage = marker.customIcon;
    
    if(marker.customIcon == "") {
        $("#hotspotImage").attr("src","/images/empty32.gif");
    }
    else {
        $("#hotspotImage").attr("src","/projects/" + project_id + "/" +marker.customIcon);
    }

    $("#hotspotRadius").attr("value", marker.circle.getRadius());


    dialog.dialog("open");
}

function addMarker(lat, lng, hotspot_id, _radius, image) {

    if(markerList[hotspot_id] != null) {
        alert("Error: Duplicate name: " + hotspot_id);
        return;
    }


    var myLatlng = new google.maps.LatLng(lat,lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: hotspot_id,
        draggable: true
    });



    marker.customIcon = image;
    marker.hotspot_id = hotspot_id;
    marker.radius = _radius;

    var path = "";

    if(image == "") { // Use default icon:
        path = "http://www.google.com/mapfiles/marker.png#" + hotspot_id;
    }
    else {
        path = "/projects/" + project_id + "/" + image + "#" + hotspot_id; // + "#<id>" to find the element later
    }

    marker.setIcon(path);

    // Add a 30m Radius to the marker.
    var circle = new google.maps.Circle({
        map: map,
        radius: _radius
    });

    circle.bindTo('center', marker, 'position');

    marker.circle = circle;


    // It seems as if the image is not added directly. Thus a little time
    // must pass until the contextmenu gets added
    setTimeout(function() {
        $("img[src=\"" + path + "\"]").parent().contextMenu(
            {menu: 'hotspotMenu'},
            function(action, el, pos) {
                if (action == "deleteHotspot") {
                    var cmd = new DeleteHotspotCommand();
                    cmd.setParameter("id", hotspot_id);
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
                         cmd.setParameter("hotspot_id", hotspot_id);
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

        }, 1000);
    




    markerList[hotspot_id] = marker;


    google.maps.event.addListener(marker, 'click', function() {
        if(hotspotDeleting) {
            hotspotDeleting = false;
            var cmd = new DeleteHotspotCommand();
            cmd.setParameter("id", marker.getTitle());
            cmd.setParameter("project_id", project_id);
            cmd.setParameter("mission_id", mission_id);
            cmd.execute();
        }
        else {

            openHotspotDialog(marker);
        }
    });

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

function createHotspotFromContextMenu(pos) {
    point = new google.maps.Point(pos.x, pos.y);
    latlng = overlay.getProjection().fromContainerPixelToLatLng(point);

    id = prompt("id?");

    var cmd = new AddHotspotCommand();
    cmd.setParameter("latitude", latlng.lat());
    cmd.setParameter("longitude", latlng.lng());
    cmd.setParameter("id", id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("project_id", project_id);
    cmd.execute();

}

$(document).ready(function() {

    $("#map_canvas").contextMenu({
        menu: 'mapMenu'
    },
    function(action, el, pos) {
        if (action == "newHotspot") createHotspotFromContextMenu(pos);
    });

});


$(document).ready(initialize);

