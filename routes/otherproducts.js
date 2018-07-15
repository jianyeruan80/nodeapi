var express = require('express');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
	 xlsx = require('node-xlsx'),
	 
    otherproducts = require('../models/otherproducts');

router.get('/excel', function(req, res, next) {
  var info=req.query,query={"status":"true"};
	 	query["mId"]=info["mId"];
	 	
	 	var year=info["recommend"]?"recommend":(info["year"] || "All");
	 	console.log(req.body);


    otherproducts.find(query).sort({"regDate":-1,"_id":-1}).exec(function(err,data){
			if(err)return next(err);
			var excel=[["#","注册编号","成立日期","名称(英文)","名称(中文)"]];
			for(var i in data){
				excel.push([i,data[i]["code"],data[i]["regDate"],data[i]["name"],data[i]["slName"]]);
			} 
			var buffer = xlsx.build([{name:'Company',data:excel}]);
			var pp=path.join(__dirname, '../public');
			fs.writeFileSync(pp+config.splitStr+year+'.xls', buffer, {'flag':'w'}); 
			res.json({"data":year});
		})
})
router.get('/', function(req, res, next) {
	  var info=req.query,query={"status":"true"};
	 	query["mId"]=info["mId"];
    
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
