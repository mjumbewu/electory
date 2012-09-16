var Electory = Electory || {};

(function($, E) {

  E.Util = {
    geocode: function(address, success) {
      var geocoder = 'http://services.phila.gov/ULRS311/Data/Location/';
      $.get(geocoder + address, success);
    }
  }

})(jQuery, Electory);
