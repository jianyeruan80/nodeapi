var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
	 jwt = require('jsonwebtoken'),
    otheradmins = require('../models/otheradmins');
/* GET users listing. */
router.get('/', security.ensureAuthorized,function(req, res, next) {
	 var info=req.query,query={};
	 	query["mId"]=req.token["mId"] || info["mId"];

     otheradmins.findOne(query,function(err,data){
			if(err)return next(err);
			res.json(data);
		})

});
router.post('/login',function(req, res, next) {
   	var info=req.body,query={};
	 delete info["clientTimeZone"]
     otheradmins.findOne(info,function(err,data){
			if(err)return next(err);
			if(!data)return next({"code":60006})
		    var returnData=JSON.parse(JSON.stringify(data));		
			var accessToken = jwt.sign(
	            {"mId":returnData["mId"],"zoneTime":0,"id":returnData["_id"]},config.secret,{
	              expiresIn: '12000m',
	              algorithm: 'HS256'
	            });
			   	returnData["token"]=accessToken;
			 res.json(returnData);
		})
});

module.exports = router;
