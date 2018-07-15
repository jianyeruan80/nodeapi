var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
    otherproducts = require('../models/otherproducts');

router.get('/', function(req, res, next) {
	  var info=req.query,query={"status":"true"};
	 	query["mId"]=info["mId"];
      console.log(query)
     otherproducts.find(query).sort({"regDate":-1,"_id":-1}).exec(function(err,data){
			if(err)return next(err);
			res.json(data);
		})


});
router.post('/', security.ensureAuthorized,function(req, res, next) {
      var info=req.body;
	   var dao = new otherproducts(info);
	   dao.save(function (err, data) {
	   if (err) return next(err);
	          res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	  delete info["_id"]
	    otherproducts.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });
});
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	  delete info["_id"]
	    otherproducts.findByIdAndUpdate(req.params.id,{"status":new Date().getTime()},{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });
});

module.exports = router;
