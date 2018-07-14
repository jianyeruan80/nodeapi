var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var security = require('../modules/security'),
    admins = require('../models/admins'),
    roles = require('../models/roles'),
    stores = require('../models/stores'),
     tools = require('../modules/tools'),
      fs=require('fs'),
	 path = require('path'),
	 async=require('async'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
    permstemps = require('../models/permstemps'),
    //permsView = require('../models/permsView'),


    config = require('../modules/config'),
    jwt = require('jsonwebtoken');
    
router.get('/', security.ensureAuthorized,function(req, res, next) {
	 var query={"type":"ADMIN"};
     admins.find(query).sort({"mId":-1}).exec(function(err,data){
			if(err)return next(err);
		    res.json(data);
		})
});
router.get('/query', security.ensureAuthorized,function(req, res, next) {
	 var query={"type":"","mId":req.token["mId"],"status":"true"};
     admins.find(query).sort({"_id":1}).exec(function(err,data){
			if(err)return next(err);
		    res.json(data);
		})
});
router.post('/', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	    info.mId=req.token.mId;
	    info.createdAt=tools.defaultDate();
		info.updatedAt=info.createdAt;
		info.operator={};
		info.operator.id=req.token.id;
		info.operator.user=req.token.user;
		info["password"]=security.setPwd(info);
		info["type"]="";
		delete info["_id"];
	   var dao = new admins(info);
			   dao.save(function (err, data) {
			   if (err) {if(err["code"]=="11000")err["message"]="User already exists!";return next(err)}
			   	      res.json(data);
			   });
		    
		
	  
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.updatedAt=tools.defaultDate();
	 delete info["createdAt"];
	 delete info["type"];
	 if(info["password"] && info["password"].length<=30)
	 {info["password"]=security.setPwd(info);}
	 else{
	 delete info["password"];
	 }
   admins.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                      if (err) {if(err["code"]=="11000")err["message"]="User already exists!";return next(err)}
                       res.json(data);
     });
});
router.post('/admin', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	    info.mId=req.token.mId;
	    info.createdAt=tools.defaultDate();
		info.updatedAt=info.createdAt;
		info.operator={};
		info.operator.id=req.token.id;
		info.operator.user=req.token.user;
		info["password"]=security.setPwd(info);
		var query={"type":"ADMIN"};
	   delete info["_id"];
	   if(!((typeof info.status=="boolean" && info.status) || info.status=="true")){
	 	info.status=new Date().getTime();
	   }
	   admins.findOne(query).sort({"_id":-1}).limit(1).exec(function(err,data){
			if(err)return next(err);
			if(data){
		      	var mId ="M"+(Math.pow(10,7)+parseInt(data["mId"].substring(1))+1).toString().substring(1);
		      	
       		 	info["mId"]=mId;	

		      }else{
		      	info["mId"]="M0000001";
		      }
		       var dao=new stores({"mId":info["mId"],"name":"Restautant Name"});
		        dao.save(function (err, data) {
		       	 if (err) return next(err);
		      	   var photoPath=path.join(__dirname, '../public')+'/'+info["mId"];
					    fs.exists(photoPath, function(exists) {
					    if (!exists)mkdirp(photoPath, function (err) {
					        if (err) console.error(err)
					        else console.log('pow!')
					     });
					    
					});
		      	  var adminDao = new admins(info);
				   adminDao.save(function (err, data) {
				   if (err) return next(err);
				   	      res.json(data);
				   });
		       })
		       
		    
		})
	  
});
router.put('/admin/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.createdAt=tools.defaultDate();
	 delete info["createdAt"];
	 delete info["type"];
	 if(!((typeof info.status=="boolean" && info.status) || info.status=="true")){
	 	info.status=new Date().getTime();
	 }
	 if(info["password"] && info["password"].length<=30)
	 {info["password"]=security.setPwd(info);}
	 else{
	 delete info["password"];
	 }

     admins.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                       if (err) return next(err);
                       res.json(data);
     });
});
router.post('/login',security.ensureAuthorized,function(req, res, next) {

	var info=req.body;
    var	query={"email":info["email"],"password":security.setPwd(info),"status":"true"};
		if(info["mId"])query["mId"]=info["mId"];

		   admins.find(query,function(err,data){
				
		  	   if(err)return next(err);
			   if(data.length==0)return next({"code":"60001"});
			   if(data.length>1){
			   		res.json(data);
			   		return
			   }else{
			   	 var returnData={},permsList=["View"];
			   	 returnData=JSON.parse(JSON.stringify(data[0]));
			   	 returnData["permsJson"]={};
			   	 returnData["nav"]=[];
			   	 var accessToken = jwt.sign(
	            {"mId":returnData["mId"],"zoneTime":0,"id":returnData["_id"]},config.secret,{
	              expiresIn: '12000m',
	              algorithm: 'HS256'
	            });
			   	returnData["accessToken"]=accessToken;

			   	
async.waterfall([
    function (done) {
    	var permsList=[];
			   	if(!returnData["type"]){
			    permsList=["View"];		
			   	permsList=permsList.concat(returnData["perms"]);
                for(var i in returnData["roles"]){
			   			returnData["roles"][i]=new mongoose.Types.ObjectId(returnData["roles"][i]);
			    }


			  roles.aggregate([{$match:{"_id":{$in:returnData["roles"]}}}]).exec(function(err,roleList){
				   		if(err)return next(err);
				   		for(var i in roleList){
				   			permsList=permsList.concat(roleList[i]["perms"]);
				   		}
				   		done(null, permsList);	
					 
				  })
				
					
			}else{
				done(null, permsList);		
			}
        
    }
], function (error, result) {
	
	var permSql={};
	if(result.length>0){
	for(var k in result){if(result[k]!="View")result[k] = new mongoose.Types.ObjectId(result[k])
				   			}
				   		
				   		permSql={"_id":{"$in":result}};
				   	}
				
    permstemps.aggregate([
			    { $match: permSql }
			    ]).exec(function(err,data){
					
						   	 	if(err)return next(err);
						   	 	
						   	 	for(var i in data){
						   	 		 if(data[i]["permCode"]=="V"){
						   	 		 	returnData["nav"].push(data[i]);
						   	 		 }else{
						   	 		 	 if(returnData["permsJson"][data[i]["name"]]){
						   	 		 	 	returnData["permsJson"][data[i]["name"]].push(data[i]["permCode"]);
						   	 		 	 }else{
						   	 		 	 	returnData["permsJson"][data[i]["name"]]=[];
						   	 		 	 	returnData["permsJson"][data[i]["name"]][0]=data[i]["permCode"];
						   	 		 	 }
						   	 		 }
						   	 	}
						   	 	delete returnData["password"];
							   	 res.json(returnData);
						   	 })
			   	 		
})
			   	
	


				
			}

			   

		  })
		
});

router.post('/superLogin',security.ensureAuthorized,function(req, res, next) {
	  var info=req.body;
	  var query={"email":info["email"],"password":security.setPwd(info),"status":"true","type":"SUPERADMIN"};
	  admins.findOne(query,function(err,data){
			if(err)return next(err);
			if(!data)return next({"code":"60001"});
			 var accessToken = jwt.sign(
            {"mId":data.mId,"zoneTime":0,"id":data._id},config.secret,{
              expiresIn: '12000m',
              algorithm: 'HS256'
            });
		
		
			returnData=JSON.parse(JSON.stringify(data));
			returnData["accessToken"]=accessToken;
			delete returnData["password"];
			 res.json(returnData);
		})
		
});
router.put('/changePassword/:id', security.ensureAuthorized,function(req, res, next) {
	   var info=req.body;
       var oldPassword=security.setPwd(info);
	   var query={"_id":req.params["id"],"password":oldPassword};
	   
	    admins.findOne(query,function(err,data){
	    	 if(err)return next(err); 
	    	 if(!data)return next({"code":"60004"});
	    	 info["password"]=info["newPwd"];
	 
	    	 oldPassword=security.setPwd(info);
	    	 admins.findByIdAndUpdate(req.params.id,{"password":oldPassword},function (err, data) {
	    	 	if(err)return next(err);
	    	 	 res.json(data);
	    	 })
	    })   
	 /* admins.findByIdAndUpdate(req.params.id,updateInfo,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });*/

})
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	  var updateInfo={};
	  updateInfo.updatedAt=tools.defaultDate();
	  updateInfo.status=new Date().getTime();
	  admins.findByIdAndUpdate(req.params.id,updateInfo,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });

})

module.exports = router;
