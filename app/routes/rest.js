var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlService = require('../services/urlService');
var statsService =  require('../services/statsService');

// 这是已经进入/api/v1之后，然后路径是/urls，我们要做的
router.post('/urls', jsonParser, function(req, res){
  var longUrl = req.body.longUrl;
  urlService.getShortUrl(longUrl, function(url){
      res.json(url);
  });
});


router.get( "/urls/:shortUrl", function(req, res){
  var shortUrl = req.params.shortUrl;
  urlService.getLongUrl(shortUrl, function(url){
    if (url) {
      res.json(url);
    }else{
      res.status(404).send("what??????????");
    }
  });
});

router.get( "/urls/:shortUrl/:info", function(req, res){
    statsService.getUrlInfo( req.params.shortUrl, req.params.info, function(data){
        res.json(data);
    });
});

module.exports = router;
