var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
    sizes = require('../models/sizes');
/* GET users listing. */
router.get('/', security.ensureAuthorized,function(req, res, next) {
	var info=req.query,query={"status":"true"};
	query["mId"]=req.token["mId"] || info["mId"];
	 sizes.find(query).sort({"order":1,"_id":1}).exec(function(err,data){
			if(err)return next(err);
			res.json(data);
		})

});
var getSizes=function(query){
	var query={};
	query["mId"]=query["mId"];
	sizes.find(query).sort({"order":1,"_id":1}).exec(function(err,data){
			if(err)return next(err);
			res.json(data);
		})
}
router.post('/', security.ensureAuthorized,function(req, res, next) {
    var info=req.body;
	    info.mId=req.token.mId;
	    info.createdAt=new Date();
		info.updatedAt=info.createdAt;
		info.operator={};
		info.operator.id=req.token.id;
		info.operator.user=req.token.user;
	    delete info["_id"];
	 
	   var dao = new sizes(info);
	   dao.save(function (err, data) {
	   if (err) {if(err["code"]=="11000")err["message"]="Size already exists!";return next(err)}
	        res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.createdAt=new Date();
	 delete info["createdAt"];
	
	    sizes.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                       if (err) {if(err["code"]=="11000")err["message"]="Size already exists!";return next(err)}
                      
           res.json(data);
     });
});
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	 sizes.findByIdAndUpdate(req.params.id,{"status":new Date().getTime()},{new: true},function (err, data) {
          if (err) return next(err);
          res.json(data);
     });
});


module.exports = router;
