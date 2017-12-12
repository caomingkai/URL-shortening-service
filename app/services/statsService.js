
var geoip = require('geoip-lite');
var RequestModel = require( '../models/requestModel');

var logRequest = function( shortUrl, req ){
    var reqInfo = {};
    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || 'Unknown';
    reqInfo.platform = req.useragent.platform || 'Unknown';
    reqInfo.browser = req.useragent.browser || 'Unknown';
    var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

    var geo = geoip.lookup(ip);
    var geo1 = geoip.lookup("::ffff:66.249.79.26");
    console.log(ip);
    console.log(geo1);
    console.log(geo1.country);

    if(geo){
        reqInfo.country = geo.country;
        console.log(geo.country);

    } else {
        reqInfo.country = 'Unknown';
    }
    reqInfo.timestamp = new Date();
    var request = new RequestModel(reqInfo);
    request.save();
};

var getUrlInfo = function(shortUrl, info, callback ){
    if( info === 'totalClicks' ){
        RequestModel.count( { shortUrl: shortUrl }, function( err, data){
            callback(data);
        });
        return;
    }

    var groupId = "";

    if( info === 'hour'){
        groupId ={
            year: {$year: "$timestamp"},
            month: {$month: "$timestamp"},
            day: {$dayOfMonth: "$timestamp"},
            hour: {$hour: "$timestamp"},
            minutes: {$minute: "$timestamp"},
        }
    } else if( info === 'day'){
        groupId ={
            year: {$year: "$timestamp"},
            month: {$month: "$timestamp"},
            day: {$dayOfMonth: "$timestamp"},
            hour: {$hour: "$timestamp"}
        }
    } else if( info === 'month'){
        groupId ={
            year: {$year: "$timestamp"},
            month: {$month: "$timestamp"},
            day: {$dayOfMonth: "$timestamp"}
        }
    } else {   // other parameters not related to time, like "referer/conntry/..."
        groupId = "$" + info;
    };

    RequestModel.aggregate([
        {
            $match:{
                shortUrl: shortUrl
            }
        },
        {
            $sort:{
                timestamp: -1
            }
        },
        {
            $group:{
                _id: groupId,
                count:{
                    $sum: 1
                }
            }
        }
    ], function(err, data){
        callback(data);
    });

};
module.exports = {
    logRequest: logRequest,
    getUrlInfo: getUrlInfo
};
