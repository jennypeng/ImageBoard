var express = require('express');
var routes = require('./routes');
var user = require('./routes/user')
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test');
const ppp = 5; //number of posts per page


var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
// link processing
app.get('/', routes.pPosts(db, ppp));
app.get('/post/:id', routes.expandpost(db));
app.get('/users', user.list);
app.get('/posts', routes.pPosts(db, ppp));
app.get('/newpost', routes.newpost);
var fs = require('fs');
app.post('/addpost', routes.addpost(db));
app.post('/post/:id/addreply', routes.addreply(db));
app.get('/posts/p/:page', routes.pPosts(db, ppp));
app.get('/post/:id/:file', routes.dlPosts(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

