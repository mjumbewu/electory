<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Electory</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Electory &mdash; Find Your Local Election Leaders">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="libs/bootstrap/2.1.1/css/bootstrap.css" rel="stylesheet">
    <link href="libs/bootstrap/2.1.1/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="http://cdn.leafletjs.com/leaflet-0.4.4/leaflet.css" rel="stylesheet">
    <link href="electory/style.css" rel="stylesheet">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
<!--    <link rel="shortcut icon" href="libs/ico/favicon.ico">-->
<!--    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="libs/ico/apple-touch-icon-144-precomposed.png">-->
<!--    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="libs/ico/apple-touch-icon-114-precomposed.png">-->
<!--    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="libs/ico/apple-touch-icon-72-precomposed.png">-->
<!--    <link rel="apple-touch-icon-precomposed" href="libs/ico/apple-touch-icon-57-precomposed.png">-->
  </head>

  <body class="electory">

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">

          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>

          <a class="brand" href="#">electory</a>

          <div class="nav-collapse collapse">
            <form id="header-login-form" class="navbar-form pull-right">
              <button class="btn">Sign In</button>
            </form>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div id="app-container" class="container">

      <section id="intro-screen" class="intro-screen">
        <h1>The directory of election leaders in your community</h1>

        <form id="big-location-search">
          <input type="text" class="input-xxlarge" placeholder="Enter your address, district, or ward here">
          <button class="btn btn-large">Search</button>
        </form>
      </section>

      <section id="division-screen" class="division-screen">
      </section>

      <form id="authentication-modal" class="modal hide fade">
      </form>

      <form id="leader-edit-modal" class="modal hide fade">
      </form>

    </div> <!-- /container -->

    {literal}
      <script id="auth-header-info-template" type="text/x-handlebars-template">
      </script>

      <script id="auth-form-template" type="text/x-handlebars-template">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3>Log in</h3>
        </div>

        <div class="modal-body">
          <p>Enter your voter registration information to make a change in <em>Electory</em>.  We do this to ensure that only the voter themselves modifies the voter's information.</p>

          <div class="control-group">
            <label class="control-label" for="firstName">Date of birth</label>
            <div class="controls">
              <div class="input-append">
                <input class="input-small" value="{{ dob_year }}" type="text" id="dob-year" name="dob_year" placeholder="e.g. 1983">
                <input class="input-mini" value="{{ dob_month }}" type="text" id="dob-month" name="dob_month">
                <input class="input-mini" value="{{ dob_day }}" type="text"   id="dob-day" name="dob_day">
              </div>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="house-number">House number</label>
            <div class="controls">
              <input value="{{ houseno }}" name="houseno" type="text" id="house-number">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="cancel-btn btn">Cancel</button>
          <button type="submit" class="auth-btn btn btn-primary">Authenticate</button>
        </div>
      </script>

      <script id="leader-form-template" type="text/x-handlebars-template">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3>{{ action }} Leader</h3>
        </div>

        <div class="modal-body">
          <div class="control-group">
            <label class="control-label" for="leader-firstname-input">Date of birth</label>
            <div class="controls">
              <div class="input-append">
                <input class="input-medium" value="{{ firstname }}" type="text" id="leader-firstname-input" name="firstname" placeholder="">
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="cancel-btn btn">Cancel</button>
          <button type="submit" class="save-leader-btn btn btn-primary">Save</button>
        </div>
      </script>

      <script id="division-template" type="text/x-handlebars-template">
        <div id="division{{ cid }}" class="row">
          <section class="general-division-info span4">
            <header>
              <h1 class="division">Division {{ DIVISION }}</h1>
              <h2 class="ward">Ward {{ WARD }}</h2>
              <p>for {{ MATCHED_ADDRESS }}</p>
            </header>

            <div class="division-map"></div>
          </section>

          <section class="division-leader-board-info span8">
          </section>
        </div>
      </script>

      <script id="leader-board-template" type="text/x-handlebars-template">
        <header><h1>Election Leader Board</h1></header>

        <ol class="leaders">
        </ol>

        <div class="add-leader">
          <p>Should you be on this list?</p>
          <button class="btn btn-mini"><i class="icon-plus-sign"></i> Add your information...</button>

        </div>
      </script>

      <script id="leader-template" type="text/x-handlebars-template">
        <article class="leader-info">
          <span class="avatar"></span>
          <span class="name">
            {{ firstname }} {{ lastname }}{{# party }} ({{ . }}){{/ party }}
          </span>
          <span class="address">{{# address }}{{ . }}, {{/ address }}Philadelphia, PA {{ zip }}</span>
          <span class="classification">{{ pretty_type }}</type>
          <span class="updated-status">
            <span class="score {{ score }}"></span>
            <span class="last-updated"></span>
        </span>
        </article>

        <div class="leader-controls">
          <span class="like"><button class="btn btn-success btn-mini"><i class="icon-thumbs-up icon-white"></i></button></span>
          <span class="edit"><button class="btn btn-warning btn-mini"><i class="icon-pencil icon-white"></i></button></span>
          <span class="flag"><button class="btn btn-danger btn-mini"><i class="icon-flag icon-white"></i></button></span>
          <span class="delete"><button class="btn btn-inverse btn-mini"><i class="icon-trash icon-white"></i></button></span>
        </div>

        <hr>
      </script>

      <script id="leader-form-template" type="text/x-handlebars-template">
        <form class="leader-form form-horizontal">
          <input type="hidden" name="test_data" value="created at hacks4d">

          <div class="control-group">
            <label class="control-label" for="first_name">First Name</label>
            <div class="controls">
              <input type="text" name="first_name" placeholder="">
            </div>
          </div>
          <div class="control-group">
            <label class="control-label" for="last_name">Last Name</label>
            <div class="controls">
              <input type="text" name="last_name" placeholder="">
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="address">Street Address</label>
            <div class="controls">
              <input type="text" name="address" placeholder="">
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="email">Email</label>
            <div class="controls">
              <input type="text" name="email" placeholder="">
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="phone">Phone</label>
            <div class="controls">
              <input type="text" name="phone" placeholder="">
            </div>
          </div>
        </form>
      </script>
  {/literal}

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta6/handlebars.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.0/moment.min.js"></script>
    <script src="http://cdn.leafletjs.com/leaflet-0.4.4/leaflet.js"></script>
    <script src="libs/bootstrap/2.1.1/js/bootstrap.min.js"></script>
    <script src="libs/bootstrap/2.1.1/js/bootstrap-collapse.js"></script>

    <script src="electory/util.js"></script>
    <script src="electory/models.js"></script>
    <script src="electory/views.js"></script>
    <script src="electory/routes.js"></script>
    <script src="electory/app.js"></script>

  </body>
</html>
