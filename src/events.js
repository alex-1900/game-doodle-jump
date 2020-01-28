(function(window, document) {
  "use strict"

  window.events = {
    appStart: new CustomEvent('app-start'),
    appPause: new CustomEvent('app-pause'),
    appStop: new CustomEvent('app-stop'),
  };

})(window, window.document);
