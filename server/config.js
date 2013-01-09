
var express = require("express")
  , path = require('path')
  , secret = require('./secret.js');

module.exports = function configure(app) {
  app.configure(function(){
    
    
    app.set('port', process.env.PORT || 3001);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use('/admin', express.basicAuth(function(user, pass){
      return secret.admin.user == user & secret.admin.pass == pass;
    }));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir:'./uploads'}));
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(require('less-middleware')({ src: __dirname + '/../public' }));
    app.use(express.static(path.join(__dirname, '/../public')));
    // required password for admins
    
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

}