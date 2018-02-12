//=========================== NODE.JS ===========================


var express = require('express');
var app = express();

var restRouter = require('./routes/rest');
var redirectRouter = require( './routes/redirect');
var indexRouter = require( './routes/index');

var useragent = require( 'express-useragent');

// using MongoDB, rather than gloable variable like below
var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds259085.mlab.com:59085/urlshortening', { useMongoClient: true });



// // global variable to substitute MongoBD
// app.longToShortHash = {};
// app.shortToLongHash = {};
//

app.use('/node_modules',express.static(__dirname + "/node_modules"));

app.use('/public',express.static(__dirname + "/public"));

app.use(useragent.express());

app.use('/api/v1', restRouter);             // response to app request, sending info to app webpage

app.use('/' , indexRouter );                // response to outside's request

app.use( '/:shortUrl', redirectRouter );    // response to outside's request, not app

app.listen(3000);




/*

// import the http module
var http = require('http');
var fs = require('fs');

// pass in callback function
http.createServer( function(req, res){


  //---- test 1: text-plain
  if( req.url === '/' ){
    res.writeHead(200, {"Content-Type" : "text-plain"});
    res.end("Heloowfldkfdsdfd , sdfdlfd;l ");
  }



  //---- test 2: text-html
  // res.writeHead(200, {"Content-Type" : "text-html"});
  // var html = fs.readFileSync( __dirname + "/11.html");
  // res.end(html);



  //---- test 3: application/json
  if( req.url === '/api' ){
    res.writeHead(200, {"Content-Type" : "application/json"});
    var obj = {
      name: "mingkai",
      age: 100
    };
    res.end(JSON.stringify(obj));
  }


}).listen(3000);
*/


//=========================== EXPRESS ===========================

/*
// ex 1
var express = require( 'express' );
var app = express();

app.get('/',  function( req, res){
  res.send({
    name: "zzz",
    age: 18
  });

  // res.send("express server agian");

});

app.listen(3000);


*/
