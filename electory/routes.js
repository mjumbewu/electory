var Electory = Electory || {};

(function($, E) {

  E.App = Backbone.Router.extend({
    initialize: function() {
      this.conductor = new E.ConductorView({app: this});
    },

    routes: {
      '': 'intro',
      'search/:place': 'search',
      'division/:number': 'division'
    },

    intro: function() {
      this.conductor.showIntro();
    },

    search: function(place) {
      var divisionPattern = /^(\d+)$/,
          match = divisionPattern.exec(place),
          division;

      if (match === null) {
        division = E.Division.fromAddress(place);
      } else {
        division = E.Division.fromNumber(match[0]);
      }

      this.conductor.showDivision(division);
    },

    division: function(number) {
      var division = E.Division.fromNumber(number);
      this.conductor.showDivision(division);
    }
  });

})(jQuery, Electory);
