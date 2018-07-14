var crypto = require('crypto'),
   config = require('./config'),
   security = require('./security'),
   admins = require('../models/admins'),
   perms = require('../models/perms'),
   jwt = require('jsonwebtoken');

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
    console.log("Finish!");
})