var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
	 md5 = require('md5'),
	 
 

     notepads = require('../models/notepads');
    
 

/* GET users listing. */
/*router.get('/read/:title',function(req, res, next) {
 var info=req.query,query={},returnData={};
	 	 query["onlyUrl"]=req.params["title"];
         notepads.findOne(query,function(err,data){
			if(err)return next(err);
			if(data){
				returnData=JSON.parse(JSON.stringify(data));
				delete returnData["password"];}
			    res.json(returnData);
		})


});*/
router.get('/:title',function(req, res, next) {

console.log("xxxxxxxxxxxxxxxxxxxx")
 var info=req.query,query={},returnData={};
	 	 query["title"]=req.params["title"];
	 	 returnData["title"]=query["title"];
	 	 if(info["isRead"]=="true")query={"onlyUrl":req.params["title"]};
	 	 console.log("xxxxxxxxx");
	 	 console.log(query)
	 	 console.log("xxxxxxxxx");
         notepads.findOne(query,function(err,data){
			if(err)return next(err);
			if(data){
			returnData=JSON.parse(JSON.stringify(data));
				if(data["password"] && info["isRead"]=="false"){
					delete returnData["content"];
					returnData["isLogin"]=true;	
				}
			}
			delete returnData["password"];
			res.json(returnData);
			
		})
});

router.post('/login', security.ensureAuthorized,function(req, res, next) {
    var info=req.body,query={};
       query["title"]=info["title"];
       query["password"]=md5(info["title"]+info["password"]);
	   notepads.findOne(query,function(err,data){
			if(err)return next(err);
			res.json(data);
		})
});
router.post('/title',function(req, res, next) {
 var info=req.body,query={},returnData={};

	 	 query["title"]=info["title"];
	 	 query["password"]=md5(info["title"]+info["password"]);
	 	 console.log(query)
         notepads.findOne(query,function(err,data){
			if(err)return next(err);
			if(data){
			returnData=JSON.parse(JSON.stringify(data));
				if(data["password"])
					delete returnData["password"];
					res.json(returnData);
					
				
			}else{
				return next({"code":"60005"});
			}
			
			
		})
});
router.post('/',function(req, res, next) {
    var info=req.body,returnData={};
	    info.mId="M0000001";
	    info.createdAt=new Date();
		info.updatedAt=info.createdAt;
      if(info["password"]){info["password"]=md5(info["title"]+info["password"])}
      delete info["_id"];
      var dao = new notepads(info);
	   dao.save(function (err, data) {
	   if (err) return next(err);
	   		if(data){
			returnData=JSON.parse(JSON.stringify(data));
			delete returnData["password"];}	
	          res.json(returnData);
	      });
});
router.put('/:id',function(req, res, next) {
	    var info=req.body,returnData={};
	    info.updatedAt=new Date();
	    delete info["createdAt"];
	 	if(info["password"])info["password"]=md5(info["title"]+info["password"]);
        notepads.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                       if (err) return next(err);
        	if(data){
			returnData=JSON.parse(JSON.stringify(data));
			delete returnData["password"];}          
            res.json(returnData);
     });
});




module.exports = router;
