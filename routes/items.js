var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
	 tools = require('../modules/tools'),
	 async=require('async'),
    items = require('../models/items');

router.get('/', security.ensureAuthorized,function(req, res, next) {
	 var info=req.query,query={"status":"true"};
	 query["mId"]=req.token["mId"] || info["mId"];
     items.find(query).sort({"_id":-1}).exec(function(err,data){
			if(err)return next(err);
			 res.json(data);
		})

});
router.post('/query', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body,query={"$and":[{"status":"true"}]};
         query["$and"].push({"mId":req.token["mId"]});
         if(info["search"]){
	 	 	var temp={"$or":[{"name":{"$regex":info["search"],"$options":"i"}}]};
            query["$and"].push(temp);
	 }

		items.find(query).sort({"order":1,"_id":1}).exec(function(err,data){
			if(err)return next(err);
			 res.json(data);
			
		})



     
});
router.post('/', security.ensureAuthorized,function(req, res, next) {
    var info=req.body;
	    info.mId=req.token.mId;
	    info.createdAt=new Date();
		info.updatedAt=info.createdAt;
		info.operator={};
		info.operator.id=req.token.id;
		info.operator.user=req.token.user;
	    delete info["_id"];
	   for(var i in info["sizes"]){
	    	delete info["sizes"][i]["_id"];
	    }
	    for(var i in info["optionGroups"]){
	    	  delete info["optionGroups"][i]["_id"];
	    	  for(var j in info["optionGroups"][i]["options"]){
	    	  		delete info["optionGroups"][i]["options"][j]["_id"];
	    	  }
	    }
	   var dao = new items(info);
	   dao.save(function (err, data) {
	   if (err) {if(err["code"]=="11000")err["message"]="Item already exists!";return next(err)}
	          res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.updatedAt=tools.defaultDate();
	 delete info["createdAt"];
	  for(var i in info["sizes"]){
	  	    if(!info["sizes"][i]["_id"])
	    	delete info["sizes"][i]["_id"];
	    }
			  for(var i in info["optionGroups"]){
			  	    if(!info["optionGroups"][i]["_id"])
	    	  		delete info["optionGroups"][i]["_id"];
	    	  for(var j in info["optionGroups"][i]["options"]){
	    	  	    if(!info["optionGroups"][i]["options"][j]["_id"])
	    	  		delete info["optionGroups"][i]["options"][j]["_id"];
	    	  }
	    }
	    
	    items.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                      if (err) {if(err["code"]=="11000")err["message"]="Item already exists!";return next(err)}
                      
            			res.json(data);
     });
});
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	  var updateInfo={};
	  updateInfo.updatedAt=tools.defaultDate();
	  updateInfo.status=new Date().getTime();
	  items.findByIdAndUpdate(req.params.id,updateInfo,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });

})

module.exports = router;

