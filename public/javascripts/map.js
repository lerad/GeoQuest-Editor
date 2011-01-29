function createMarker(point,html) {
            var marker = new GMarker(point);
            GEvent.addListener(marker, "click", function() {
             marker.openInfoWindowHtml(html);
             });
            return marker;
        }

        // this is called when the page loads.
        // it initializes the map, and creates each marker
        function initialize() {
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            /*<%@places.each do |place|%>
            var point = new GPoint(<%=place[:longitude]%>,<%=place[:latitude]%>);
            var marker = createMarker(point,'<div><%=h place[:description]%></div>')
            map.addOverlay(marker);
            <%end%>*/
        }

$(document).ready(initialize);

//initialize();