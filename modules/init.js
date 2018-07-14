var crypto = require('crypto'),
   config = require('./config'),
   security = require('./security'),
   admins = require('../models/admins'),
   perms = require('../models/perms'),
   jwt = require('jsonwebtoken');
var superJson={};
    superJson.email="superadmin@gmail.com";
    superJson.password="888888";
    superJson.mId="M0000001";
    superJson.type="SUPERADMIN";
    superJson.status="true";
    superJson.password=security.setPwd(superJson);
    var options={"upsert":true,"multi":true};
    var query={"type":superJson.type};
    admins.update(query,superJson,options,function (err, data) {
     if (err)  console.log(err);
     console.log("OK")
    });
/*var superJsonA={};
    superJsonA.email="superadmin@gmail.com";
    superJsonA.password="888888";
    superJsonA.mId="U00000000";
    superJsonA.type="SUPERADMIN";
    superJsonA.status="true";
    superJsonA.password=security.setPwd(superJsonA);
    var queryA={"type":superJsonA.type};    
    admins.update(queryA,superJsonA,options,function (err, data) {
     if (err)  console.log(err);
    });*/

var options={"upsert":true,"multi":true};
var p1={
    name:"Store",code:"Store",order:1,url:"store",status:"true","default":true,perm:[
      {"name":"Edit","code":"E"}
    ]
};
var p2={
    name:"Customer",code:"Customer",order:2,url:"customer",status:"true",perm:[
      {"name":"View","code":"V"},{"name":"Edit","code":"E"},{"name":"Delete","code":"D"}
    ]
};

var p3={
    name:"Role",code:"Role",order:101,url:"role",status:"true",perm:[
      {"name":"View","code":"V"},{"name":"Edit","code":"E"},{"name":"Delete","code":"D"},
    ]
};
var p4={
    name:"User",code:"User",order:102,url:"user",status:"true",perm:[
      {"name":"View","code":"V"},{"name":"Edit","code":"E"},{"name":"Delete","code":"D"},
    ]
};
var updateList=[];
updateList.push(p1);
updateList.push(p2);
updateList.push(p3);
updateList.push(p4);
for(var i in updateList){
    updateList[i]["order"]=i;
    perms.update({"name":updateList[i]["name"]},updateList[i],options,function (err, data) {
         if (err)  console.log(err);
         
    })
}
setTimeout(function(){ createTemp() }, 2000);
function createTemp(){
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
}

