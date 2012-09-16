var Electory = Electory || {};

var testDivision = {
  "id": "4c25bf740e0e6e41c8291bb19541b4a2",
  "__class__": "Division",
  "ward": 63,
  "division": 16,
  "centroid": {
    "__type__": "geopoint",
    "latitude": 40.09170151,
    "longitude": -75.05110168
  },
  "polling_place": {
    "name": "LEHIGH BAPTIST CHURCH",
    "address": "934 ALBURGER AVE",
    "__type__": "geopoint",
    "latitude": 40.0923996,
    "longitude": -75.04869843
  }
};

var testLeaders = {
  "success": true,
  "total": 1,
  "divisions": {
    "4c25bf740e0e6e41c8291bb19541b4a2": {
      "__class__": "Division",
      "ward": 63,
      "division": 16,
      "centroid": {
      "__type__": "geopoint",
      "latitude": 40.09170151,
      "longitude": -75.05110168
    },
    "polling_place": {
      "name": "LEHIGH BAPTIST CHURCH",
      "address": "934 ALBURGER AVE",
      "__type__": "geopoint",
      "latitude": 40.0923996,
      "longitude": -75.04869843
      }
    }
  }
};

(function($, E) {

  // Leaders
  E.Leaders = Backbone.Collection.extend({
    url: 'http://election-leaders.sites.emr.ge/leaders',

    parse: function(resp, xhr) {
      var leaders = [],
          ids = _.keys(resp.leaders);

      _.each(ids, function(id) {
        var leader = resp.leaders[id];
        leader.id = id;
        leaders.push(leader);
      });

      return leaders;
    }
  });

  E.Leaders.forDivision = function(division) {
    var leaders = new E.Leaders();
    leaders.url = 'http://election-leaders.sites.emr.ge/leaders?division=' + division.get('division');

    leaders.reset(testLeaders);
    return leaders;
  };

  // Divisions
  E.Division = Backbone.Model.extend({
    parse: function(resp, xhr) {
      var divisions = [],
          ids = _.keys(resp.divisions);

      _.each(ids, function(id) {
        var division = resp.divisions[id];
        division.id = id;
        divisions.push(division);
      });

      return divisions;
    }
  });

  E.Division.fromAddress = function(address) {
    var division = new E.Division();

    E.Util.geocode(address, function(location) {
      division.url = 'http://election-leaders.sites.emr.ge/divisions?near=';
      division.url += location.latitude + ',' + location.longitude;

      division.set(testDivision);
    });

    return division;
  };

  E.Division.fromNumber = function(number) {
    var division = new E.Division();

    division.url = 'http://election-leaders.sites.emr.ge/divisions?division=';
    division.url += number;

    division.set(testDivision);

    return division;
  };

})(jQuery, Electory);
