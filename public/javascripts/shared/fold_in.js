/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */

$(document).ready(function() {
    $("#rightFoldIn").data("geoquest", {expanded : true});
    $("#rightFoldIn").click(function() {
        data = $("#rightFoldIn").data("geoquest");
        if(data.running) return; // Wait until it is fully open or closed
        data.running = true;
        
        if(data.expanded) {
            data.expanded = false;
            $("#control").animate({
                width: "20pt"
            }, {
                duration: 500,
                complete: function() {  
                    $("#rightFoldIn").data("geoquest").running = false;
                    $("#rightFoldIn").attr("src", "/images/BlueArrowLeft.gif");
                    $("#rightFoldIn").trigger("geoquest.resize");
                }
            });
            $(".content").animate({
                right: "80pt"
            }, 500);
        }
        else {
            data.expanded = true;
            $("#control").animate({
                width: "150pt"
            }, {
                duration: 500,
                complete: function() {
                    $("#rightFoldIn").data("geoquest").running = false;
                    $("#rightFoldIn").attr("src", "/images/BlueArrowRight.gif");
                    $("#rightFoldIn").trigger("geoquest.resize");
                }
            });
            $(".content").animate({
                right : "210pt"
            }, 500);

        }
    });
});




$(document).ready(function() {
    $("#leftFoldIn").data("geoquest", {expanded : true});
    $("#leftFoldIn").click(function() {
        data = $("#leftFoldIn").data("geoquest");
        if(data.running) return; // Wait until it is fully open or closed
        data.running = true;

        if(data.expanded) {
            data.expanded = false;
            $("#navigation").animate({
                width: "20pt"
            }, {
                duration: 500,
                complete: function() {
                    $("#leftFoldIn").data("geoquest").running = false;
                    $("#leftFoldIn").attr("src", "/images/BlueArrowRight.gif");
                    $("#leftFoldIn").trigger("geoquest.resize");
                }
            });
            $(".content").animate({
                left: "80pt"
            }, 500);
        }
        else {
            data.expanded = true;
            $("#navigation").animate({
                width: "150pt"
            }, {
                duration: 500,
                complete: function() {
                    $("#leftFoldIn").data("geoquest").running = false;
                    $("#leftFoldIn").attr("src", "/images/BlueArrowLeft.gif");
                    $("#leftFoldIn").trigger("geoquest.resize");
                }
            });
            $(".content").animate({
                left : "210pt"
            }, 500);

        }
    });
});