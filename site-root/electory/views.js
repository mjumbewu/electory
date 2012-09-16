var Electory = Electory || {};

(function($, E) {

  E.ConductorView = Backbone.View.extend({
    initialize: function() {
      this.app = this.options.app;
      this.introView = new E.IntroView({app: this.options.app});
    },

    showIntro: function() {
      $('#intro-screen').show();
      $('#division-screen').hide();
    },

    showDivision: function(division) {
      this.divisionView = new E.DivisionView({model: division, app: this.app});

      $('#intro-screen').hide();
      $('#division-screen').html(this.divisionView.render().$el);
    }
  });


  E.IntroView = Backbone.View.extend({
    el: '#intro-screen',

    events: {
      'submit #big-location-search': 'onSearch'
    },

    onSearch: function(evt) {
      evt.preventDefault();
      place = this.$('#big-location-search input[type="text"]').val();
      this.options.app.navigate('search/' + place, {trigger: true});
    }
  });


  E.DivisionView = Backbone.View.extend({
    initialize: function() {
      this.app = this.options.app;
      this.division = this.model;
      this.leaders = new E.Leaders();

      this.mapView = new E.DivisionMapView({
        model: this.division,
        app: this.app
      });

      this.leadersView = new E.LeaderBoardView({
        collection: this.leaders,
        app: this.app
      });

      this.template = {
        render: Handlebars.compile($('#division-template').html())
      };

      this.division.on('change', this.onDivisionChange, this);
    },

    onDivisionChange: function() {
      this.leaders.fetchForDivision(this.division)
      this.render();
    },

    render: function() {
      var context = _.extend({
            cid: this.division.cid
          }, this.division.toJSON()),
          content,
          leaderBoardContent;

      content = this.template.render(context);
      this.$el.html(content);

      this.mapView.setElement(this.$el.find('.division-map'));
      this.mapView.render();

      leaderBoardContent = this.leadersView.render().$el;
      this.$el.find('.division-leader-board-info')
        .html(leaderBoardContent);

      return this;
    }
  });


  E.LeaderBoardView = Backbone.View.extend({
    initialize: function() {
      this.app = this.options.app;
      this.leaders = this.collection;
      this.template = {
        render: Handlebars.compile($('#leader-board-template').html()),
        renderForm: Handlebars.compile($('#leader-form-template'))
      };

      this.initLeaderViews();

      this.leaders.on('add', this.onAddLeader, this);
      this.leaders.on('remove', this.onRemoveLeader, this);
      this.leaders.on('reset', this.onResetLeaders, this);
    },
    
    events: {
      'click .add-leader button': 'onClickAddLeaderButton'
    },
    
    onClickAddLeaderButton: function() {
      var context = {},
          $form = this.template.renderForm(context);
      
      
    },

    onAddLeader: function(leader) {
      this.addLeaderView(leader);
      this.renderLeaderView(leader);
    },

    onRemoveLeader: function(leader) {
      this.removeLeaderView(leader);
      this.destroyLeaderView(leader);
    },

    onResetLeaders: function() {
      this.leaders.each(_.bind(this.removeLeaderView, this));
      this.initLeaderViews();
      this.render();
    },

    initLeaderViews: function() {
      this.leaderViews = {};
      this.leaders.each(_.bind(this.addLeaderView, this));
    },

    addLeaderView: function(leader) {
      this.leaderViews[leader.cid] = new E.LeaderView({
        app: this.app,
        model: leader,
        tagName: 'li'
      });
    },

    removeLeaderView: function(leader) {
      var leaderView = this.leaderViews[leader.cid];
      if (leaderView) leaderView.remove();
    },

    destroyLeaderView: function(leader) {
      delete this.leaderViews[leader.cid];
    },

    render: function() {
      var content = this.template.render();

      this.$el.html(content);
      _.each(this.leaderViews, _.bind(this.renderLeaderView, this));

      return this;
    },

    renderLeaderView: function(leaderView) {
      var content = leaderView.render().$el;
      this.$el.find('.leaders').append(content);
    }
  });


  E.LeaderView = Backbone.View.extend({
    initialize: function() {
      this.app = this.options.app;
      this.leader = this.model;

      this.template = {
        render: Handlebars.compile($('#leader-template').html())
      };
    },

    render: function() {
      var classifications = {'CM': 'Committee Member', 'WL': 'Ward Leader'},
          prettyType = function() {return classifications[this.type];},
          context = _.extend({pretty_type: prettyType}, this.leader.toJSON()),
          content;

      content = this.template.render(context);
      this.$el.html(content);

      return this;
    }
  });


  E.DivisionMapView = Backbone.View.extend({
    initialize: function() {
//      this.model.on('change', this.render, this);
    },

    render: function() {
      if (_.keys(this.model.toJSON()).length) {
        var pollingPlace = this.model.get('polling_place'),
            map;

        // create a map in the "map" div, set the view to a given place and zoom
        map = L.map(this.el).setView([this.model.get('CENTROID_Y'),
                                      this.model.get('CENTROID_X')], 16);

        // add a CloudMade tile layer with style #997
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png')
          .addTo(map);

        // add a marker in the given location, attach some popup content to it and open the popup
        L.marker([this.model.get('POLLING_Y'), this.model.get('POLLING_X')]).addTo(map)
          .bindPopup(this.model.get('POLLING_PL'))
          .openPopup();

        this.map = map;
      }
    }
  });

})(jQuery, Electory);
