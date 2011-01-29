
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

                addMarker(lat, lng, id);
                
                jQuery.post("/hotspots/create",
                    "id=" + id +
                    "&latitude=" + lat +
                    "&longitude=" + lng +
                    "&project=" + project
                    );
                hotspotCreating = false;
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
        jQuery.post("/hotspots/update",
            "id=" + marker.getTitle() +
            "&latitude=" + marker.getPosition().lat() +
            "&longitude=" + marker.getPosition().lng() +
            "&project=" + project
            );
        
    });


    
}




$(document).ready(initialize);

//initialize();