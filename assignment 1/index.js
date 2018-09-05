var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req,res){
  var urlparser = url.parse(req.url,true);
  var path = urlparser.pathname;
  var shortPath = path.replace(/^\/+|\/+$/g, '');
  var queryStringObject = urlparser.query;
  var method = req.method.toUpperCase();
  var headers = req.headers;
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data){
    buffer += decoder.write(data);
  });

  req.on('end',function(){
    buffer += decoder.end();
    var chosenHandler = typeof(router[shortPath]) !== 'undefined' ? router[shortPath] : handlers.notFound;
    var data = {
      'shortPath' : shortPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    chosenHandler(data,function(statusCode,payload){
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object'? payload : {};
      var payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});

server.listen(3000,function(){
  console.log('The server is listening at port 3000');
});

var handlers = {};

handlers.hello = function(data,callback){
    callback(200,{'prank':'you just got punked'});
};

handlers.notFound = function(data,callback){
  callback(404);
};

var router = {
  'hello' : handlers.hello
};
