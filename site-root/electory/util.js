var Electory = Electory || {};

(function($, E) {

  E.Util = {
    geocode: function(address, success) {
      var geocoder = 'http://services.phila.gov/ULRS311/Data/Location/',
          localAddress = address.replace(/\./g, ''),
          comma = localAddress.indexOf(',');

      if (comma > -1) {
        localAddress = localAddress.substr(0, comma);
      }

      $.get(geocoder + localAddress, success);
    },

    buildPollApiUrl: function(x, y) {
      var base = 'http://gis.phila.gov/ArcGIS/rest/services/PhilaGov/PollingPlaces/MapServer/0/query?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&returnCountOnly=false&returnIdsOnly=false&returnGeometry=false&outFields=*&f=pjson&geometry=';
      var geometry = '{"x":' + x + ',"y":' + y + '}';
      return base + encodeURIComponent(geometry);
    },

    findPollInfo: function(x, y, success) {
      var url = E.Util.buildPollApiUrl(x, y);
      $.get(url, success);
    },

    matchWardAndDivision: function(string) {
      var matches;

      matches = (/ward (\d+).*division (\d+)/gi).exec(string);
      if (matches) {
        return {ward: matches[1], division: matches[2]};
      }

      matches = (/(\d+).. ward.*(\d+).. division/gi).exec(string);
      if (matches) {
        return {ward: matches[1], division: matches[2]};
      }

      matches = (/division (\d+).*ward (\d+)/gi).exec(string);
      if (matches) {
        return {ward: matches[2], division: matches[1]};
      }

      matches = (/(\d+).. division.*(\d+).. ward/gi).exec(string);
      if (matches) {
        return {ward: matches[2], division: matches[1]};
      }

      return null;
    },

    getAttrs: function($form) {
      var attrs = {};

      // Get values from the form
      _.each($form.serializeArray(), function(item, i) {
        attrs[item.name] = item.value;
      });

      return attrs;
    },
  };

})(jQuery, Electory);
