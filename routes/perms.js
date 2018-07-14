var express = require('express');
var router = express.Router();
var security = require('../modules/security'),
    perms = require('../models/perms');
/* GET users listing. */
router.get('/', security.ensureAuthorized,function(req, res, next) {
     perms.find({}).sort({"order":1,"_id":1}).exec(function(err,data){
			if(err)return next(err);
			
		     res.json(data);
		})
});


router.post('/createTable', security.ensureAuthorized,function(req, res, next) {
  perms.aggregate([
    {
        "$addFields": {
            "perms": {
                "$cond": [
                    {
                        "$ne": [
                            "$default",
                            true
                        ]
                    },
                    "$perm",
                    {
                        "$setUnion": [
                            "$perm",
                            [
                                {
                                    "_id": "View",
                                    "name": "View",
                                    "code": "V"
                                }
                            ]
                        ]
                    }
                ]
            }
        }
    },
    {
        "$unwind": {
            "path": "$perms",
            "preserveNullAndEmptyArrays": true
        }
    },
    {
        "$sort": {
            "order": 1.0,
            "_id": 1.0
        }
    },
    {
        "$project": {
            "_id": "$perms._id",
            "name": 1.0,
            "status": 1.0,
            "url": 1.0,
            "order": 1.0,
            "code": 1.0,
            "permName": "$perms.name",
            "permCode": "$perms.code"
        }
    },
         { $out : "permstemps" }
    
]).exec(function(err,data){
   if (err) return next(err);
	          res.json(data);
	      });
})

router.post('/', security.ensureAuthorized,function(req, res, next) {
    var info=req.body;
	    info.merchantId=req.token.merchantId;
	    info.createdAt=new Date();
		info.updatedAt=info.createdAt;
		info.operator={};
		info.operator.id=req.token.id;
		info.operator.user=req.token.user;
	    delete info["_id"];
	    for(var i in info["perm"]){
	    	if(!info["perm"][i]["_id"]) delete info["perm"][i]["_id"];
	    }

	   var dao = new perms(info);
	   dao.save(function (err, data) {
	   if (err) return next(err);
	          res.json(data);
	      });
});
router.put('/:id', security.ensureAuthorized,function(req, res, next) {
	 var info=req.body;
	 info.createdAt=new Date();
	 delete info["createdAt"];
	 for(var i in info["perm"]){
	    	if(!info["perm"][i]["_id"]) delete info["perm"][i]["_id"];
	    }
	    
     perms.findByIdAndUpdate(req.params.id,info,{new: true},function (err, data) {
                       if (err) return next(err);
                      
            res.json(data);
     });
});
module.exports = router;
