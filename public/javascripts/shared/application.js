// Init global tooltips

$(document).ready(function() {
   initQTip($(".title-as-tooltip"));
});

function initQTip(object) {
    object.qtip({
    position: {
      corner: {
         target: 'topRight',
         tooltip: 'bottomLeft'
      },
      adjust: {
          screen: true
      }
    },
    style: {
        name: "light",
        tip: 'leftBottom',
        border: {
         width: 7,
         radius: 5
        }
    },
    show: {
        delay: 500
    }
});
}