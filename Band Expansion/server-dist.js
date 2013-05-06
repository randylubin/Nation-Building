/**
 * Module dependencies.
 */

var express = require('express'),
  app = express();

// Configuration
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/dist'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.set('port', 8788);
});

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});

/*
app.get('/blank', function (req, res) {
  res.sendfile(__dirname + '/app/index.html');
})
*/
app.get('/bands', function (req, res) {
  res.contentType('application/json');
  res.sendfile(__dirname + '/dist/bands.json');
});


var server = app.listen(app.settings.port);
console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);
