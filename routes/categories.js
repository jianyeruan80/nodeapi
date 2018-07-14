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
    categories = require('../models/categories');
/* GET users listing. 
//Page 1
db.users.find().limit (10)
//Page 2
db.users.find().skip(10).limit(10)
//Page 3
query.Where(xxx...xxx).Skip(pageIndex*pageSize).Take(pageSize)
db.users.find().skip(20).limit(10)
db.users.find().skip(pagesize*(n-1)).limit(pagesize)
db.usermodels.find({'_id' :{ "$gt" :ObjectId("55940ae59c39572851075bfd")} }).
limit(20).sort({_id:-1})
db.users.find().limit(pageSize);
users = db.users.find({'_id'> last_id}). limit(10);
*/
router.get('/', security.ensureAuthorized,function(req, res, next) {
	 var info=req.query,query={"status":"true"};
	 query["mId"]=req.token["mId"] || info["mId"];
	 
     categories.find(query).sort({"order":1,"_id":1}).exec(function(err,data){
			if(err)return next(err);
			 res.json(data);
		})

});
router.post('/query', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body,query={"$and":[{"status":"true"}]};
         query["$and"].push({"mId":req.token["mId"]});
          if(info["search"]){
	 	 	var temp={"$or":[{"name":{"$regex":info["search"],"$options":"i"}}
	 	 				
	 	 			]};
            query["$and"].push(temp);
	 }

		categories.find(query).sort({"order":1,"_id":1}).exec(function(err,data){
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
	    if(!info["taxes"]){
	    	delete info["taxes"];
	    }
	    for(var i in info["optionGroups"]){
	    	  		delete info["optionGroups"][i]["_id"];
	    	  for(var j in info["optionGroups"][i]["options"]){
	    	  		delete info["optionGroups"][i]["options"][j]["_id"];
	    	  }
	    }
	   var dao = new categories(info);
	   dao.save(function (err, data) {
	   if (err) {if(err["code"]=="11000")err["message"]="Category already exists!";return next(err)}
	          res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.updatedAt=tools.defaultDate();
	 delete info["createdAt"];
	 if(!info["taxes"]){
	    	delete info["taxes"];
	    }
			  for(var i in info["optionGroups"]){
			  	    if(!info["optionGroups"][i]["_id"])
	    	  		delete info["optionGroups"][i]["_id"];
	    	  for(var j in info["optionGroups"][i]["options"]){
	    	  	    if(!info["optionGroups"][i]["options"][j]["_id"])
	    	  		delete info["optionGroups"][i]["options"][j]["_id"];
	    	  }
	    }
	    
	    categories.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                      if (err) {if(err["code"]=="11000")err["message"]="Category already exists!";return next(err)}
                      
            			res.json(data);
     });
});
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	  var updateInfo={};
	  updateInfo.updatedAt=tools.defaultDate();
	  updateInfo.status=new Date().getTime();
	  categories.findByIdAndUpdate(req.params.id,updateInfo,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });

})

module.exports = router;

