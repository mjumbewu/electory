var Electory = Electory || {};

(function($, E) {

  E.Util = {
    geocode: function(address, success) {
      var geocoder = 'http://services.phila.gov/ULRS311/Data/Location/';
      $.get(geocoder + address, success);
    },
    
    buildPollApiUrl: function(x, y) {
      var base = 'http://gis.phila.gov/ArcGIS/rest/services/PhilaGov/PollingPlaces/MapServer/0/query?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&returnCountOnly=false&returnIdsOnly=false&returnGeometry=false&outFields=*&f=pjson&geometry=';
      var geometry = '{"x":' + x + ',"y":' + y + '}';
      return base + encodeURIComponent(geometry);
    },
    
    findPollInfo: function(x, y, success) {
      var url = E.Util.buildPollApiUrl(x, y);
      $.get(url, success);
    }
  };

})(jQuery, Electory);
