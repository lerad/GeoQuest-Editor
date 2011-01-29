function createMarker(point,html) {
            var marker = new GMarker(point);
            GEvent.addListener(marker, "click", function() {
             marker.openInfoWindowHtml(html);
             });
            return marker;
        }

        // this is called when the page loads.
        // it initializes the map, and creates each marker

        var map;

        function initialize() {
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        addHotspotMarker();

        }

function addMarker(lat, lng, text) {
 var myLatlng = new google.maps.LatLng(lat,lng);

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: text
  });
    
}

$(document).ready(initialize);

//initialize();