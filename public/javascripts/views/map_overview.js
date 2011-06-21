
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


var hotspotDialogHtml = 'Radius (m): <input id="hotspotRadius" type="text" size="4" /><br /> \
                         Image: <img src="" id="hotspotImage" /><br />      \
                         <input type="button" id="changeHotspotProperties" value="Ok" />'

var selectedMarker = null;
var selectedImage = "";
var dialog = $('<div></div>')
		.html(hotspotDialogHtml)
		.dialog({
			autoOpen: false,
			title: 'Hotspot Eigenschaften',
                        width: 300

		});

var imageSelector = new ImageSelector(changeHotspotImage);


function changeHotspotImage(file) {
    $("#hotspotImage").attr("src", "/projects/" + project_id + "/" + file);
    selectedImage = file;
}

$(document).ready(function() {
   $("#hotspotImage").click(function() {
        imageSelector.show();
   });
   $("#changeHotspotProperties").click(function() {
      selectedMarker.customIcon = selectedImage;
   });

   $("#changeHotspotProperties").click(function() {
       dialog.dialog("close");
       var radius = $("#hotspotRadius").attr("value");
       var cmd = new UpdateHotspotCommand();
       cmd.setParameter("project_id", project_id);
       cmd.setParameter("mission_id", mission_id);
       cmd.setParameter("hotspot_id", selectedMarker.title);
       cmd.setParameter("radius", radius);
       cmd.setParameter("image", selectedImage);
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

function addMarker(lat, lng, text, _radius, image) {

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

    marker.customIcon = image;

    if(image != "") {
        marker.setIcon("/projects/" + project_id + "/" + image);
    }

   // Add a 30m Radius to the marker.
   var circle = new google.maps.Circle({
          map: map,
          radius: _radius
        });

    circle.bindTo('center', marker, 'position');

    marker.circle = circle;



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



$(document).ready(initialize);

