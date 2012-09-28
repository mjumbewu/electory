var Electory = Electory || {};

(function($, E) {

  E.ConductorView = Backbone.View.extend({
    initialize: function() {
      this.app = this.options.app;
      this.introView = new E.IntroView({app: this.app});
      this.headerAuthView = new E.HeaderAuthView({app: this.app, model: this.options.voter});
      this.authView = new E.AuthView({app: this.app, model: this.options.voter});
    },

    showIntro: function() {
      $('#intro-screen').show();
      $('#division-screen').hide();
    },

    showDivision: function(division, leaders) {
      this.divisionView = new E.DivisionView({model: division,
                                              collection: leaders,
                                              app: this.app});

      $('#intro-screen').hide();
      $('#division-screen').show().html(this.divisionView.render().$el);
    },

    showAuthenticationForm: function(nextFunc) {
      this.authView.nextFunc = nextFunc;
      this.authView.render().$el.modal('show');
    },

    showNewLeaderForm: function(leaders) {
      this.leaderFormView = new E.AddLeaderView({collection: leaders});
      this.leaderFormView.render().$el.modal('show');
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


  E.AuthView = Backbone.View.extend({
    el: '#authentication-modal',

    initialize: function() {
      this.template = {
        render: Handlebars.compile($('#auth-form-template').html())
      };

      this.model.on('fail', this.onAuthenticationFail, this);
      this.model.on('succeed', this.onAuthenticationSucceed, this);
    },

    events: {
      'click .auth-btn': 'onClickAuthButton'
    },

    onClickAuthButton: function(evt) {
      evt.preventDefault();
      var credentials = E.Util.getAttrs(this.$el);

      credentials.dob = credentials.dob_year + '-' + credentials.dob_month + '-' + credentials.dob_day;
      delete credentials['dob_year'];
      delete credentials['dob_month'];
      delete credentials['dob_day'];

      this.model.authenticate(credentials);
    },

    onAuthenticationSucceed: function() {
      this.$el.modal('hide');

      if (this.nextFunc) {
        this.nextFunc();
      }
    },

    onAuthenticationFail: function() {
      alert('authentication failed: ' + this.model.error);
    },

    render: function() {
      var dob = this.model.get('dob') || '',
          context = _.extend({
            dob_year: dob.substr(0, 4),
            dob_month: dob.substr(5, 2),
            dob_day: dob.substr(8, 2)
          }, this.model.toJSON());
      this.$el.html(this.template.render(context));
      return this;
    }
  });


  E.HeaderAuthView = Backbone.View.extend({
    el: '#header-login-form',

    initialize: function() {
      this.model.on('change', this.render, this);
    },

    events: {
      'click button': 'onClickHeaderSignInButton'
    },

    onClickHeaderSignInButton: function(evt) {
      evt.preventDefault();
      this.options.app.navigate('/login', {trigger: true});
    },

    render: function() {
      if (this.model.isAuthenticated()) {
        this.$el.html('<p>' + this.model.id + '</p>');
      }
    }
  });


  E.DivisionView = Backbone.View.extend({
    initialize: function() {
      this.app = this.options.app;
      this.division = this.model;
      this.leaders = this.collection;

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
      this.leaders.fetchForDivision(this.division);
      this.render();
    },

    render: function() {
      var context = _.extend({
            cid: this.division.cid,
            MATCHED_ADDRESS: this.division.matchedAddress || ''
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
      };

      this.initLeaderViews();

      this.leaders.on('add', this.onAddLeader, this);
      this.leaders.on('remove', this.onRemoveLeader, this);
      this.leaders.on('reset', this.onResetLeaders, this);
    },

    events: {
      'click .add-leader button': 'onClickAddLeaderButton',
    },

    onClickAddLeaderButton: function() {
      this.app.navigate('/search/' + this.app.loadedPlace + '/add-leader', {trigger: true});
    },

    onAddLeader: function(leader) {
      var leaderView = this.addLeaderView(leader);
      this.renderLeaderView(leaderView);
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
      leaderView = new E.LeaderView({
        app: this.app,
        model: leader,
        tagName: 'li'
      });
      this.leaderViews[leader.cid] = leaderView;
      return leaderView;
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
      this.delegateEvents();

      return this;
    },

    renderLeaderView: function(leaderView) {
      var content = leaderView.render().$el;
      this.$el.find('.leaders').append(content);
    }
  });


  E.AddLeaderView = Backbone.View.extend({
    el: '#leader-edit-modal',

    initialize: function() {
      this.leaders = this.collection;
      this.template = {
        render: Handlebars.compile($('#leader-form-template').html())
      };
    },

    events: {
      'submit': 'onSaveLeader'
    },

    onSaveLeader: function(evt) {
      evt.preventDefault();

      var attrs = E.Util.getAttrs(this.$el);
      this.leaders.create(attrs,
      {
        wait: true,
        success: function() {
            this.$el.modal('hide');
            this.app.navigate('/search/' + this.loadedPlace);
          },
        error: function(leaders, jqXHR, options) {
            jqXHR.responseText
          }
      });
    },

    render: function() {
      var context = {};

      this.$el.html(this.template.render(context));
      return this;
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
