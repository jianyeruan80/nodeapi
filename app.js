var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs=require('fs');
var FileStreamRotator = require('file-stream-rotator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./modules/config');
var mongoose = require('./modules/mongoose');
var security = require('./modules/security');
var routes = require('./routes/index');
var admins = require('./routes/admins');
var perms = require('./routes/perms');
var roles = require('./routes/roles');
var stores = require('./routes/stores');
var customers = require('./routes/customers');
var sizes = require('./routes/sizes');
var categories = require('./routes/categories');
var items = require('./routes/items');
var notepads = require('./routes/notepads');
var otheradmins = require('./routes/otheradmins');
var otherads = require('./routes/otherads');
var otherproducts = require('./routes/otherproducts');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb',extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res){
    res.send('hello world');
});
app.use('/api/admins', admins);
app.use('/api/perms', perms);
app.use('/api/roles', roles);
app.use('/api/stores', stores);
app.use('/api/customers', customers);
app.use('/api/sizes', sizes);
app.use('/api/categories', categories);
app.use('/api/items', items);
app.use('/api/notepads', notepads);
app.use('/api/otheradmins', otheradmins);
app.use('/api/otherads', otherads);
app.use('/api/otherproducts', otherproducts);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
var customerError={
          "60001":"Email and password do not match !",
          "60002":"Server is error !",
          "60003":"Token is expires or error !",
          "60004":"Old password do not match !",
          "60005":"Password do not match !",
          "60006":"User and Password not match !"
    
         
 }
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
  console.log("xxxxxxxxxxxxxxxxxxxxxx");
   res.status(err.status || 200).json({
         code:err.code,
         message: customerError[err.code]?customerError[err.code]:err.message,
     });
  
  });
}*/

 app.use(function(err, req, res, next) {
 /* if(!err.code){
   res.redirect("/views");
  }else{*/
    console.log(err);
      res.status(err.status || 200).json({
         code:err.code,
         message: customerError[err.code]?customerError[err.code]:err.message
     });
  //}
});

var server = app.listen(config.appPort, function () {
  var host = server.address().address;
  var port = server.address().port;
  var x = new Date();
  var offset= -x.getTimezoneOffset();
  config.zoneTime=parseFloat(offset)*60;
  config.environment=process.env.OS;
  if(config.environment && config.environment.indexOf("Windows")>=0) config.splitStr="\\";
   console.log('Server is running at http://%s:%s', host, port);
   //require('./modules/init');
});

/*const WebSocket = require('ws');
global.wss  = new WebSocket.Server({ port: 11368 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
});
*/