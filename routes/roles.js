var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var security = require('../modules/security'),
    roles = require('../models/roles'),
    stores = require('../models/stores'),
    permstemps = require('../models/permstemps'),
     tools = require('../modules/tools'),


    config = require('../modules/config'),
    jwt = require('jsonwebtoken');

router.get('/', security.ensureAuthorized,function(req, res, next) {
	 var query={"mId":req.token["mId"],"status":"true"};
      roles.find(query,function(err,data){
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
	   
	  var dao = new roles(info);
			   dao.save(function (err, data) {
			   if (err) {if(err["code"]=="11000")err["message"]="Role already exists!";return next(err)}
			   	      res.json(data);
			   });
		    
		
	  
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.createdAt=new Date();
	 delete info["createdAt"];
	 	info.operator={};
		info.operator.id=req.token.id;
		info.operator.user=req.token.user;
	 roles.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                      if (err) {if(err["code"]=="11000")err["message"]="Role already exists!";return next(err)}
                       res.json(data);
     });
});

router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	  var updateInfo={};
	  updateInfo.updatedAt=tools.defaultDate();
	  updateInfo.status=new Date().getTime();
	  updateInfo.operator={};
	  updateInfo.operator.id=req.token.id;
	  updateInfo.operator.user=req.token.user;
	  roles.findByIdAndUpdate(req.params.id,updateInfo,function (err, data) {
                     if(err)return next(err);
                      
            res.json(data);
     });

})

module.exports = router;
