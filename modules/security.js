var crypto = require('crypto'),
   config = require('./config'),
   
   logs = require('./logs'),
   moment = require('moment'),
   md5 = require('md5'),
   

   jwt = require('jsonwebtoken');
module.exports.encrypt = function(str) {
	var iv = new Buffer('');
	var key = new Buffer(config.key, 'hex');
	var cipher = crypto.createCipheriv('aes-128-ecb', key, config.ivStr);
	var encryptedStr = cipher.update(new Buffer(str, 'utf8'),'buffer', 'base64');
	encryptedStr += cipher.final('base64');
	return encryptedStr;

};

module.exports.setPwd = function(obj) {
 return md5(obj["email"]+obj["password"]+config.secret);
}
module.exports.decrypt = function(str) {
	var iv = new Buffer('');
	var key = new Buffer(config.key, 'hex');
	var decipher = crypto.createDecipheriv('aes-128-ecb', key, config.ivStr);
	var chunks = [];
	var decryptedStr = decipher.update(new Buffer(str, 'base64'), 'binary', 'utf8');
	decryptedStr += decipher.final('utf8');
	return decryptedStr;
};

module.exports.generateRequestToken = function() {
	var token = null;
	try {
		var buf = crypto.randomBytes(16);
		token = buf.toString('hex');
	} catch (ex) {
		console.log('Fail to generate random token, ex:' + ex);
	}
	return token;
}

module.exports.createApiToken = function() {
	  return crypto.randomBytes(16).toString('hex');
}
var urlList='"/api/admins/superLogin","/api/admins/login","/api/orders"';
module.exports.ensureAuthorized=function(req, res, next) {
 
    var url=req.baseUrl+req.route.path;
  
    
    logs.info("Time:"+moment().format('H:mm:ss')+"["+Object.keys(req.route.methods)[0]+" "+url+"]",req.body);
    var bearerToken;
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];

        if(bearerToken==config.token && urlList.indexOf(url)!=-1){
              req.token=bearerToken;
              next();
         }else{ 
            
             jwt.verify(bearerToken, config.secret, function(err, decoded) {
                if(err)return next(err);
                console.log(decoded)
                req.token=decoded;
                next();
            
            })
       }
      
    } else {
        res.json({code:60003});
    }

}


