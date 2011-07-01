
// from can be either a mission or a hotspot description. It only has to have an id
function addEvent(data, from, event) {

  // Not all events are a Mission call:
  if(event.next_mission == null) return;

  style = {
    lineWidth: 3,
    strokeStyle: "black"
  };

  hoverStyle = {
    lineWidth: 6,
    strokeStyle: "blue"
  };

  my_overlays = [[ "Arrow", {location:0.9} ]];

  anchors = ["TopLeft", "TopCenter", "TopRight", "LeftMiddle", "RightMiddle",
             "BottomLeft", "BottomCenter", "BottomRight"];

  jsPlumb.connect({
      source: (from.id + "-box"),
      target: (event.next_mission + "-box"),
      paintStyle: style,
      hoverPaintStyle: hoverStyle,
      overlays: my_overlays,
      endpoint: ["Dot", {radius: 1}],
      label: event.type,
      connector: ["Bezier", {curviness: 30}],
      dynamicAnchors: anchors,
      labelStyle : {fillStyle:"rgba(255,255,255, 0.8)", color:"black",borderWidth:10}

} );


}


function addElements(data) {

    missions = data.missions;
    hotspots = data.hotspots;

    // Add Mission elements:
    $.each(missions, function(mission_index, mission) {
       $(".content").append($('<div class="mission-box" id="' + mission.id + '-box"><p>' + mission.name + '</p></div>'))
       jsPlumb.draggable($("#" + mission.id + "-box"));
    });

    // Add Hotspot elements:
    $.each(hotspots, function(hotspot_index, hotspot) {
       if(!hotspot.name) hotspot.name = hotspot.id;
       $(".content").append($('<div class="hotspot-box" id="' + hotspot.id + '-box"><p>' + hotspot.name + '</p></div>'))
       jsPlumb.draggable($("#" + hotspot.id + "-box"));
    });

    // Add connections from Mission to Mission:
    $.each(missions, function(mission_index, mission) {
       $.each(mission.on_success, function(event_index, event) {addEvent(data, mission, event);});
       $.each(mission.on_end, function(event_index, event) {addEvent(data, mission, event);});
       $.each(mission.on_fail, function(event_index, event) {addEvent(data, mission, event);});
    });

    // Add connections from Hotspot to Mission:
    $.each(hotspots, function(hotspot_index, hotspot) {
       $.each(hotspot.on_enter, function(event_index, event) {addEvent(data, hotspot, event);});
       $.each(hotspot.on_tap, function(event_index, event) {addEvent(data, hotspot, event);});
    });



}

$(document).ready(function() {

    jsPlumb.setMouseEventsEnabled(true);

    $.ajax({
        url: "/ajax/show_mission_interconnections",
        data : {
            "project_id" : project_id
        },
        success : addElements,
        error : function() {
            alert("Something has gone wrong");
        }
    });


});
