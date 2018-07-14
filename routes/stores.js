var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
    stores = require('../models/stores');
/* GET users listing. */
router.get('/', security.ensureAuthorized,function(req, res, next) {
	 var info=req.query,query={};
	 	query["mId"]=req.token["mId"] || info["mId"];

     stores.findOne(query,function(err,data){
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
	    for(var i in info["taxes"]){
	    	if(!info["taxes"][i]["_id"]) delete info["taxes"][i]["_id"];
	    }
	    for(var i in info["storeHours"]){
	    	if(!info["storeHours"][i]["_id"]) delete info["storeHours"][i]["_id"];
	    }
	    for(var i in info["deliveryFee"]){
	    	if(!info["deliveryFee"][i]["_id"]) delete info["deliveryFee"][i]["_id"];
	    }
	     if(!info["addressInfo"]["location"]){
	    	delete info["addressInfo"]["location"]
	    }
	   var dao = new stores(info);
	   dao.save(function (err, data) {
	   if (err) return next(err);
	          res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 console.log("===================");
	 console.log(info);
	 info.createdAt=new Date();
	 delete info["createdAt"];
	 for(var i in info["taxes"]){
	    	if(!info["taxes"][i]["_id"]) delete info["taxes"][i]["_id"];
	    }
	    for(var i in info["storeHours"]){
	    	if(!info["storeHours"][i]["_id"]) delete info["storeHours"][i]["_id"];
	    }
	    for(var i in info["deliveryFee"]){
	    	if(!info["deliveryFee"][i]["_id"]) delete info["deliveryFee"][i]["_id"];
	    }
	    if(!info["addressInfo"]["location"]){
	    	delete info["addressInfo"]["location"]
	    }
	    stores.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });
});

router.post('/upload', security.ensureAuthorized,function(req, res, next) {
	  var fold= req.token["mId"]
/*if(fold){
    var photoPath=path.join(__dirname, '../public')+'/'+fold;
    fs.exists(photoPath, function(exists) {
    if (!exists)mkdirp(photoPath, function (err) {
        if (err) console.error(err)
        else console.log('pow!')
     });
    
});
    console.log(fold)*/
   

   var photoPath=path.join(__dirname, '../public')+'/'+fold;
   
   var form = new multiparty.Form({uploadDir:  photoPath});
         var picJson={};
         form.parse(req, function(err, fields, files) {
  

             if(!!files.file && !!files.file[0] &&  !!files.file[0].path){
               var path=files.file[0].path.split(config.splitStr);
                  pic=path[path.length-2]+"/"+path[path.length-1];
                  picJson["key"]=fields.name[0];
                  
                   
              if(fields.rename && fields.rename[0]){
                var arr=pic.split(".");
                pic=path[path.length-2]+"/"+fields.rename[0]+".png";
                fs.rename(files.file[0].path, photoPath+"/"+fields.rename[0]+".png", function(err) {
                });
              }
              picJson["value"]=pic;
              
              
             
           } 
          res.json(picJson);
     })
  /*}else{
    return next({"code":"60002"});
  }*/
});
module.exports = router;
