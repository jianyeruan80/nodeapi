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
    customers = require('../models/customers');
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
     customers.find(query).sort({"_id":-1}).exec(function(err,data){
			if(err)return next(err);
			 res.json(data);
		})

});
router.post('/query', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body,query={"$and":[{"status":"true"}]};
         query["$and"].push({"mId":req.token["mId"]});

         
	 	 if(info["search"]){
	 	 	var temp={"$or":[{"email":{"$regex":info["search"],"$options":"i"}},
	 	 				{"phoneNum1":{"$regex":info["search"],"$options":"i"}},
	 	 				{"phoneNum2":{"$regex":info["search"],"$options":"i"}},
	 	 				{"firstName":{"$regex":info["search"],"$options":"i"}},
	 	 				{"lastName":{"$regex":info["search"],"$options":"i"}}
	 	 			]};
            query["$and"].push(temp);
	 }
	 
	 var skipNum=(parseInt(info["currentPage"])-1)*parseInt(info["pageSize"]);

	async.parallel([
	function(callback){
	
		if(info["currentPage"]<=1){
			customers.find(query).count().exec(function(err,data){
			if(err)return next(err);
			 callback(null,data)
			
			})
		}else{
			 callback(null,info["total"]);
		}
	},
	function(callback){
		customers.find(query).skip(skipNum).limit(info["pageSize"]).sort({"_id":-1}).exec(function(err,data){
			if(err)return next(err);
				callback(null,data)
			
		})

	}
],
function(err, results){
	if(err)return next(err);
	var returnData={};
		returnData["total"]=results[0];
		returnData["data"]=results[1];
		//console.log(results)
	    res.json(returnData);
	
});

     
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
	    for(var i in info["addressInfo"]){
	    	if(!info["addressInfo"][i]["_id"]) delete info["addressInfo"][i]["_id"];
	    	//info["addressInfo"][i]["location"]=[0,0];
	    }
	     if(info.birthday  && info.birthday.length<=20)info.birthday=tools.defaultDate(info.birthday);
	    
	   var dao = new customers(info);
	   dao.save(function (err, data) {
	   if (err) {if(err["code"]=="11000")err["message"]="Email already exists!";return next(err)}
	          res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.updatedAt=tools.defaultDate();
	 delete info["createdAt"];
	 for(var i in info["addressInfo"]){
	    	if(!info["addressInfo"][i]["_id"]) delete info["addressInfo"][i]["_id"];
	    	//info["addressInfo"][i]["location"]=[0,0];
	    }
	    if(info.birthday  && info.birthday.length<=20)info.birthday=tools.defaultDate(info.birthday);
	    
	    customers.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                      if (err) {if(err["code"]=="11000")err["message"]="Email already exists!";return next(err)}
                      
            			res.json(data);
     });
});
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	  var updateInfo={};
	  updateInfo.updatedAt=tools.defaultDate();
	  updateInfo.status=new Date().getTime();
	  customers.findByIdAndUpdate(req.params.id,updateInfo,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });

})

module.exports = router;
