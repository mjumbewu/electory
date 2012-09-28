var Electory = Electory || {};

(function($, E) {

  // Leaders
  E.Leader = Backbone.Model.extend({
    parse: function(resp, xhr) {
      if (resp.leader) {
        return resp.leader;
      }
      return resp;
    }
  });

  E.Leaders = Backbone.Collection.extend({
    url: 'http://election-leaders.sites.emr.ge/leaders',
    model: E.Leader,

    parse: function(resp, xhr) {
      var leaders = [],
          ids = _.keys(resp.leaders);

      _.each(ids, function(id) {
        var leader = resp.leaders[id];
        leader.id = id;
        leaders.push(leader);
      });

      return leaders;
    },

    fetchForDivision: function(division, options) {
      this.url = 'http://election-leaders.sites.emr.ge/leaders?division=' + division.get('DIVISION') + '&ward=' + division.get('WARD');
      this.fetch(options);
      this.url = 'http://election-leaders.sites.emr.ge/leaders';
    }
  });

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

      return divisions[0];
    }
  });

  E.Division.fromAddress = function(address) {
    var division = new E.Division();
    division.lookupAddress = address;

    E.Util.geocode(address, function(data) {
      var location = data.Locations[0];
      division.matchedAddress = location.Address.StandardizedAddress;

      E.Util.findPollInfo(location.XCoord, location.YCoord, function(data) {
        var divisionData = $.parseJSON(data).features[0].attributes;
        division.set(divisionData);
      });
    });

    return division;
  };

  E.Division.fromNumbers = function(wardNum, divisionNum) {
    var division = new E.Division();

    // TODO: This doesn't return valid division info -- i.e., you can't look up by
    // ward/division, only address right now.
    division.url = 'http://election-leaders.sites.emr.ge/divisions?ward=' + wardNum + 'division=' + divisionNum;
    division.set({});

    return division;
  };

  // Users
  E.Voter = Backbone.Model.extend({
    authenticate: function(credentials) {
      // dob=1988-03-08&houseno=3608&zip=19134
      var authUrl = 'http://election-leaders.sites.emr.ge/authenticate',
          voter = this;

      voter.set(credentials);
      $.post(authUrl, credentials, function(data) {
        if (data.success) {
          voter.set({id: data.id, token: data.token});
          voter.trigger('succeed');
        } else {
          voter.error = data.error;
          voter.trigger('fail');
        }
      });
    },

    isAuthenticated: function() {
      return (this.get('token') !== undefined);
    }
  });

})(jQuery, Electory);
