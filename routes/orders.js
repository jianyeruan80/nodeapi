var express = require('express');

var util = require('util');
var nodemailer = require('nodemailer');
var router = express.Router(),
	 fs=require('fs'),
	 path = require('path'),
	 multiparty = require('multiparty'),
	 mkdirp = require('mkdirp'),
	 config = require('../modules/config'),
	 security = require('../modules/security'),
	 tools = require('../modules/tools'),
	 async=require('async'),
	 counters=require('../models/counters'),
     orders = require('../models/orders');


router.post('/', function(req, res, next) {
 
async.waterfall([
  function(callback){
		      counters.findOneAndUpdate(
		   {id : "order" },
		   { $inc: { "sequence_value" : 1 } },
		   {upsert: true}
		).exec(function(err, data) {
			if (err) {err["message"]="Your Order Is Fail,Please Call 718-204-9226!";return next(err)} 
			 callback(null, data);
		})
  },
  function(arg1,  callback){
       var info=req.body;		
       info["orderId"]=1;
       if(arg1)
       info["orderId"]=arg1["sequence_value"]+1;
	   var dao = new orders(info);
	   dao.save(function (err, data) {
	  if (err) {err["message"]="Your Order Is Fail,Please Call 718-204-9226!";return next(err)} 
	   	sendPasswordResetEmail("btlaundromat@gmail.com",data);
	        res.send("Your Order Is Success")
	      });;
 }
 
 ], function (err, result) {
    if (err) {err["message"]="Your Order Is Fail,Please Call 718-204-9226!";return next(err)} 
    	//console.log(result)
    	
    
});




var passwordResetEmailTemplate =`
<html>
<head>
<meta charset="utf-8">
<title>Order Info</title>
</head>
<body>
<h2 style="color:red">%s Order Into</h2>
<table class="bordered" style=" border-spacing: 0;width: 100%;max-width:600px;border: solid #ccc 1px; border-radius: 6px;box-shadow: 0 1px 1px #ccc;">
  <thead>
  <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
  <th colspan=2 style="text-align:center;font-size:20px;  background-color: #dce9f9;padding: 10px;">Address:%s</th>
   </tr>
    </thead>
    <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">Name</td>
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">%s</td>        
     </tr>  
     <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">Phone</td>
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">%s</td>        
     </tr>  
     <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">Pickup Time:</td>
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">%s</td>        
     </tr>  
     <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">Delivery Time</td>
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">%s</td>        
     </tr> 
     <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">Option</td>
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">%s</td>        
     </tr>
     <tr style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;">
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;color:red">Note</td>
     <td style="border-left: 1px solid #ccc;border-top: 1px solid #ccc; padding: 10px;text-align: left;color:red">%s</td>        
     </tr>       
 </table>
</body>
</html>`;
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'jianyeruan@gmail.com',
        pass: 'Kyle1207'
    }
};
 var transporter = nodemailer.createTransport(smtpConfig);
//var passwordResetEmailTemplate = '<a href="http://192.168.1.100:90/#/active?e=%s&key=%s">tst</a>';
function sendPasswordResetEmail(emailAddress, data) {
	
   var emailContent = util.format(passwordResetEmailTemplate,data["name"],
   	data["address"], data["name"],data["phone"],data["deliveryTime"],data["pickupTime"],data["options"],data["note"]);
	transporter.sendMail({
		from: 'jianyeruan@gmail.com',
		to: emailAddress,
		subject: '#'+data["orderId"]+'-Order Info',
		html: emailContent
	},function(err,res){
		if (err) console.log(err);
		
        	console.log(res);
	 });
   
};

 /*    
     async.series({
one: function(callback) {
    
        callback(null, 1);
    
},
two: function(callback) {
	  var info=req.body;		
       info["orderId"]=getNextSequenceValue("orderId");
	   var dao = new orders(info);
	   dao.save(function (err, data) {
	   if (err) {return next(err)}
	          res.json(data);
	      });
},
function(err, results) {
// results is now equal to: {one: 1, two: 2}
});
*/
    
      
	   
});

/*function getNextSequenceValue(sequenceName){

   var sequenceDocument = counters.findOneAndUpdate({
      query:{id: sequenceName },
      update: {$inc:{sequence_value:1}},
      new:true
   });
	
   return sequenceDocument.sequence_value;
}*/
module.exports = router;

