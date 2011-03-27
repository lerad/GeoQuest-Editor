
var map;
var hotspotCreating = false;

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

    google.maps.event.addListener(map, "click", function(event) {

            if (hotspotCreating) {
                var id = prompt("Marker id");
                var lng = event.latLng.lng();
                var lat = event.latLng.lat();

                hotspotCreating = false;

                var cmd = new AddHotspotCommand();
                cmd.setParameter("latitude", lat);
                cmd.setParameter("longitude", lng);
                cmd.setParameter("id", id);
                cmd.setParameter("project", project);
                cmd.execute();
            }


        
    });

    addHotspotMarker();

}

function createNewHotspot() {
    hotspotCreating = true;
}

function addMarker(lat, lng, text) {
    var myLatlng = new google.maps.LatLng(lat,lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: text,
        draggable: true
    });

    google.maps.event.addListener(marker, 'click', function() {
        map.setCenter(myLatlng);
        map.setZoom(15);
    });

    google.maps.event.addListener(marker, "dragend", function() {
        var cmd = new MoveHotspotCommand();
        cmd.setParameter("id", marker.getTitle());
        cmd.setParameter("latitude", marker.getPosition().lat());
        cmd.setParameter("longitude", marker.getPosition().lng());
        cmd.setParameter("project", project);
        cmd.execute();
    });


    
}




$(document).ready(initialize);

//initialize();