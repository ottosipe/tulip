
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http');

// setup here
config(app);

// define API routes here
app.get('/', router.index);
app.get('/admin', router.admin);

// api
app.get('/menus/:type', router.menus);

app.get('/special', router.special);
app.post('/special', router.addSpecial);

app.get('/photos', router.photos);
app.get('/photo/:id', router.photo);
app.get('/photo/:id/big', router.photoBig);
app.post('/photo', router.addPhoto);

app.post('/feedback', router.feedback);
app.post('/apply', router.apply);
// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).rainbow);
});
