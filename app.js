var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cons = require('consolidate');

var stylus = require('stylus');
var nib = require('nib');
var jeet = require('jeet');
var rupture = require('rupture');
var typographic = require('typographic');
var autoprefixer = require('autoprefixer-stylus');
var flatuicolors = require('stylus-flatuicolors');
var typeutils = require('stylus-type-utils');

var routes = require('./routes/index');

var app = express();

app.engine('dust', cons.dust);


app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

  app.use(stylus.middleware({
    src: __dirname + '/views', // .styl files are located in `views/stylesheets`
    dest: __dirname + '/public', // .styl resources are compiled `/stylesheets/*.css`
    debug: true,
    force: true,
    compile: function (str, path, fn) { // optional, but recommended
      stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib()).use(jeet()).use(rupture()).use(typographic()).use(autoprefixer()).use(flatuicolors()).use(typeutils())
      .render(fn);
    }
  }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
