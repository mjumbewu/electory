var Electory = Electory || {};

(function($, E) {

  E.App = Backbone.Router.extend({
    initialize: function() {
      this.voter = new E.Voter();
      this.conductor = new E.ConductorView({app: this, voter: this.voter});

      this.searchedDivisions = {};
      _.bindAll(this);
    },

    routes: {
      '': 'intro',
      'login': 'login',
      'search/:place': 'search',
      'search/:place/add-leader': 'addLeaderToPlace',
      'search/:place/:leader/edit': 'editPlaceLeader'
    },

    authRequired: function(successFunc) {
      if (!this.voter.isAuthenticated()) {
        this.conductor.showAuthenticationForm(successFunc);
      } else {
        successFunc();
      }
    },

    intro: function() {
      this.conductor.showIntro();
    },

    login: function() {
      this.conductor.showAuthenticationForm();
    },

    getDivision: function(place) {
      var division = this.searchedDivisions[place];

      if (!division) {
        division = E.Division.fromAddress(place);
        division.leaders = new E.Leaders();
        this.searchedDivisions[place] = division;
      }

      return division;
    },

    search: function(place) {
      var division = this.getDivision(place);
      this.conductor.showDivision(division);
    },

    addLeaderToPlace: function(place) {
      var division = this.getDivision(place);
      this.conductor.showDivision(division);

      this.authRequired(_.bind(function() {

        var leaders = division.leaders;
        this.conductor.showNewLeaderForm(leaders);

      }, this));
    },

    editPlaceLeader: function(place, leader) {
      this.authRequired(_.bind(function() {



      }, this));
    }
  });

})(jQuery, Electory);
