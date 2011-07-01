// Use ajax to retrieve data

function addEvent(data, mission, event) {

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
      source: (mission.id + "-box"),
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

    // Add Mission elements:
    $.each (data.missions, function(mission_index, mission) {
       $(".content").append($('<div class="mission-box" id="' + mission.id + '-box"><p>' + mission.name + '</p></div>'))
       jsPlumb.draggable($("#" + mission.id + "-box"));
    });

    // Add connections:
    $.each(data.missions, function(mission_index, mission) {
       $.each(mission.on_success, function(event_index, event) {addEvent(data, mission, event);});
       $.each(mission.on_end, function(event_index, event) {addEvent(data, mission, event);});
       $.each(mission.on_fail, function(event_index, event) {addEvent(data, mission, event);});
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
