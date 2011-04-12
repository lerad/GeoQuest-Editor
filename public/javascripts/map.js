
var map;
var hotspotCreating = false;
var hotspotDeleting = false;
var markerList = new Array();



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

function addSubmission() {
    var id = prompt("Mission id");
    // TODO: Check if this id is used
    var type = $('#subMissionType').val();

    cmd = new AddSubmissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("submission_id", id);
    cmd.setParameter("submission_type", type);
    cmd.execute();
}

function addMarker(lat, lng, text) {

    if(markerList[text] != null) {
        alert("Error: Duplicate name: " + text);
        return;
    }


    var myLatlng = new google.maps.LatLng(lat,lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: text,
        draggable: true
    });

    markerList[text] = marker;

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
            map.setCenter(myLatlng);
            map.setZoom(15);
        }
    });

    google.maps.event.addListener(marker, "dragend", function() {
        var cmd = new MoveHotspotCommand();
        cmd.setParameter("id", marker.getTitle());
        cmd.setParameter("latitude", marker.getPosition().lat());
        cmd.setParameter("longitude", marker.getPosition().lng());
        cmd.setParameter("project_id", project_id);
        cmd.execute();
    });

}

function getMarker(id) {
    return markerList[id];
}



$(document).ready(initialize);

//initialize();