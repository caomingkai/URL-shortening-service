var UrlModel = require('../models/urlModel');
var redis = require( 'redis');

var host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT || '6379';
var redisClient = redis.createClient( port, host );


// 1 --- getShortUrl
var encode = [];
var genCharArray = function( charA, charZ ){
  var arr = [];
  var i = charA.charCodeAt(0);
  var j = charZ.charCodeAt(0);

  for(; i<=j; i++){
    arr.push(String.fromCharCode(i));
  }
  return arr;
}

encode = encode.concat(genCharArray('A','Z'));
encode = encode.concat(genCharArray('0','9'));
encode = encode.concat(genCharArray('a','z'));



var getShortUrl = function( longUrl, callback ){

  if( longUrl.indexOf('http') === -1 ){   // if user didn't input URL with a prefix 'http', then prefix it
    longUrl = "http://" + longUrl;
  }

  redisClient.get(longUrl, function(err, shortUrl){  // first, query Redis, see if cached
    if (shortUrl){
        console.log("1----------redis hit successfully!!!");
        callback({
            longUrl:longUrl,
            shortUrl:shortUrl
        });
    } else {
        // console.log("2----------redis didn't hit successfully!!!");
        UrlModel.findOne({longUrl: longUrl}, function(err, url){ // Redis didn't cache, query MongoDB
            if(url){                                             // MongoDB has such store for this longUrl
                callback(url);
            }else{                                               // MongoDB didn't store shortUrl for this longUrl
                generateShortUrl( function(shortUrl){
                    var url = new UrlModel({ shortUrl:shortUrl, longUrl:longUrl});
                    url.save();
                    redisClient.set(shortUrl, longUrl);
                    redisClient.set(longUrl, shortUrl);
                    callback(url);
                });
            }
        });
    }
  });
};

var generateShortUrl = function(callback){
  // return Object.keys(longToShortHash).length;
  UrlModel.find({}, function(err, urls){
    callback(convertTo62(urls.length));
  });
};

var convertTo62 = function( num ){
  var result = '';
  do{
    result = encode[num%62] + result;
    num = Math.floor( num / 62 );
  }while(num);
  return result;
}


// 2  --- getLongUrl
var getLongUrl = function(shortUrl, callback){
  redisClient.get(shortUrl, function(err, longUrl){
    if (longUrl){
        console.log("3---------redis hit successfully!!!");
        callback({
            longUrl: longUrl,
            shortUrl: shortUrl
        });
    } else {
        // console.log("4----------redis didn't hit successfully!!!");
        UrlModel.findOne({shortUrl: shortUrl}, function(err, url){
            callback(url);
        });
    }
  });
};


module.exports = {
  getShortUrl: getShortUrl,
  getLongUrl: getLongUrl
};
