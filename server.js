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
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.set('port', 8787);
});

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

/*
app.get('/blank', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
})
*/
app.get('/nations', function (req, res) {
  res.contentType('application/json');
  res.sendfile(__dirname + '/public/nations.json');
});

app.get('/territories', function (req, res) {
  res.contentType('application/json');
  res.sendfile(__dirname + '/public/territories.json');
});


var server = app.listen(app.settings.port);
console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);
