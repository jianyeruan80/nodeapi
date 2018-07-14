
var  fs = require('fs'),
path = require('path'),
config = require('./config'),
Mailgun = require('mailgun-js'),
schedule = require('node-schedule'),
rest = require('restler'),
 myCache = require('../modules/cache'), 
async=require('async'), //http://yijiebuyi.com/blog/be234394cd350de16479c583f6f6bcb6.html
moment=require('moment');
var filePath="C:/jayruanwork/app/node/test/test1.rar";
var root_path=path.join(__dirname, '../logs');
var api_key="key-321eb2f676ce7cf8841d00032bb90ade";
    
var domain="service520.com";
module.exports.logsList = function(path) {
  return new Promise(function(resolve, reject) {
         var currentPath = path || root_path;
        var w_content=getAllFiles(currentPath);
        resolve(w_content);
  })
  
}
module.exports.sendEmail=function(subject,html,emailStr){
	var mailgun = new Mailgun({apiKey: api_key, domain: domain});
        console.log(emailStr);
    var data = {
      from: subject+"<admin@service520.com>",
      to: emailStr,
      subject: subject,
      //html: 'Hi jianyeruan@gmail.com, we hear that you forgot your password. No problem. To reset your password and access your account, click on the link below. Your password will be reset and you can create a new one.'
      html:html
    }

    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
       //     res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
          //  res.render('submitted', { email : "jianyeruan@gmail.com" });
            console.log(body);
        }
    });
}
function getAllFiles(root){
  var res = [] , files = fs.readdirSync(root);
  files.forEach(function(file){
    var pathname = root+'/'+file
    , stat = fs.lstatSync(pathname);

    if (!stat.isDirectory()){
        
       res.push(pathname.replace(root_path+"/",""));
    } else {
       res = res.concat(getAllFiles(pathname));
    }
  });
  return res
}
module.exports.mergeJson=function(obj1,obj2){
    var obj3 = JSON.parse(JSON.stringify(obj1));
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]}
    return obj3;
}
 //defaultDate("","YYYY-MM--DD")
 module.exports.defaultDate=function(){
    var d=arguments[0] || "";
    var format = arguments[1] || "YYYY-MM-DDTHH:mm:ssZ"; 
    console.log(config.zoneTime)
    var currentDate= moment().add(config.zoneTime,'second').format(format);
    if(d)currentDate= moment(d).add(config.zoneTime,'second').format(format);
    return currentDate;

    
}
 module.exports.setTime=function(date,sec){ //1*24*60*60*1000
    var hour = (hour || -5 ) * 60 * 1000 * 60;
    var min = (min || 0) * 1000 * 60;
    var sec= sec || 0;
    
    var minSec=hour+min+sec;
 console.log(minSec);
    var timeObject = date || new Date();
    timeObject.setTime(timeObject.getTime() + minSec);
    console.log(timeObject);
    return timeObject;
 }

  module.exports.Date=function(n=-4){
  var timeObject= new Date();
    timeObject.setTime(timeObject.getTime() + n * 60 * 60 *1000);
    console.log(timeObject);
    return timeObject;
}

module.exports.backup = function() {
  var MINUTES = 10;
  var job = schedule.scheduleJob('*/10 * * * *', function(){
    if(myCache.get("setting")){
      var setting=JSON.parse(myCache.get("setting"));
      console.log(setting);
      var currentDate=new Date(tools.defaultDate());
      var currentSecond=currentDate.getHours()*60*60+currentDate.getMinutes()*60+currentDate.getSeconds();
      var backupArr=setting.backupTime.split(":");
      var backupSecond=backupArr[0]*60*60+backupArr[1]*60;
      if(Math.abs(currentSecond-backupSecond)<600){
       rest.post("http://127.0.0.1:"+config.appPort+"/api/db/backup", {}).on('complete', function(data, response) {return null})
      }
    }
  
});
}
 
 /*module.exports.getNextSequence = function(query) {
  return new Promise(function(resolve, reject) {
            var options = {new: false,upsert: true};
            var dateFormat= moment().format("YYYYMMDD");
     console.log(query);
    seqs.aggregate(
    [ 
   {
    $match:query
   },
     {
       $project: {
           name:"$name",
           seq:"$seq",
           seqStart:"$seqStart",
           seqEnd:"$seqEnd",
           daySign:"$daySign",
           pre:"$pre",
           len:"$len",
           date: { $dateToString: { format: "%Y%m%d", date: "$updatedAt" }},
           dateFormat:{$literal:dateFormat}
       }
     }
   ]
).exec(function (err, data) {
            if (err){reject(err);return false};
            var currentData=data[0];
          console.log("xxxxxxxxxxxxxxxxxx");
            console.log(currentData);
            currentData["pre"]=currentData.pre || "";
	    if(!currentData){reject("");return false};
            currentData.seq=parseInt(currentData.seq)+1;


              if(currentData.seqEnd && currentData.seqStart && currentData.seq>currentData.seqEnd){
                    currentData.seq=currentData.seqStart;
              }
              if(currentData.daySign && currentData.date != currentData.dateFormat){
                  currentData.seq=currentData.seqStart;
              }
              if(currentData.len > 1){
                  seqNo=currentData.pre+((Math.pow(10,currentData.len)+currentData.seq)+"").substring(1);
              }else{
                seqNo=currentData.pre+currentData.seq;
              }
              resolve(seqNo);
       
})
               
})
};*/
function send(req, res, next,data){
   /* var ipAddress=data["printerName"]["ipAddress"];
            var port=data["printerName"]["port"] || 9100;
            var type=data["printerName"]["type"] || "epson";
            tcpp.probe(ipAddress, port, function(err, available) {
             if(available){
                      printer.init({
                      type: type,
                      interface: '/dev/usb/lp0',
                      width: 48,
                      characterSet: 'SLOVENIA',
                      removeSpecialCharacters: false,            
                      replaceSpecialCharacters: true,            
                      extraSpecialCharacters:{'£':163},
                      lineChar: "-",    
                      ip: ipAddress,
                      port: port
                    });

                      console.log(data)
                    
                    printer.setTypeFontA();  
                    printer.bold(true);  
                    printer.setTextDoubleHeight();
                   printer.tableCustom([                               
                  { text:"#1241", align:"CENTER",bold:true},
                  { text:"TOGO", align:"CENTER",bold:true}
                 ]);

                     printer.setTextNormal();
                     printer.tableCustom([                               
                       { text:"jianyeruan", align:"LEFT",bold:true},         
                     { text:"Kitchen", align:"CENTER",bold:true},
                      { text:moment(tools.defaultDate()).format('LTS'), align:"RIGHT",bold:true}
                    ]);
                   
                      printer.println(lineChar2);
                      printer.setTypeFontA();  
                      printer.bold(true);  
                

                  
                  for(var i=0;i<1;i++){        
                        printer.tableCustom([                               
                            { text:"L1.Pock Over Rice L1.Pock Over", align:"LEFT",bold:true},
                            { text:" x 1", align:"CENTER",bold:true}
                         ]);
                          printer.setTextNormal();  
                          printer.bold(true);     
                          printer.println("(xxxxx) x 1");
                          printer.println("(xxxxx) x 1");
                          printer.println("(xxxxx) x 1");
                          printer.drawLine(); 
                        }
               /* printer.cut();
                printer.execute();
                printer.clear();  */
               
              /*  orders.findById(id, function (err, order) {
                     for(var i=0;i<order["itemDetails"].length;i++){
                           if(order["itemDetails"][i]["printerCount"]<=0){
                              order["itemDetails"][i]["printerCount"]=1;
                           }
                     }
                    order.save(function (err) {
                      if(err) {
                          console.error('ERROR!');
                      }
                  });
                });*/
             //    done(null, "xxxxxxxxxxxxx");

          //   }else{
              // return next({"code":"0","message":ipAddress+":"+port+" is error!"})
             //   done("X", "xxxxxxxxxxxxx");
            // }
          // });*/

}


function sendOne(req, res, next,data,done) {
  var lineChar2="================================================";
    var ipAddress=data["printerName"]["ipAddress"];
            var port=data["printerName"]["port"] || 9100;
            var type=data["printerName"]["type"] || "epson";
            tcpp.probe(ipAddress, port, function(err, available) {
             if(available){
                      printer.init({
                      type: type,
                      interface: '/dev/usb/lp0',
                      width: 48,
                      characterSet: 'SLOVENIA',
                      removeSpecialCharacters: false,            
                      replaceSpecialCharacters: true,            
                      extraSpecialCharacters:{'£':163},
                      lineChar: "-",    
                      ip: ipAddress,
                      port: port
                    });

                      console.log(data)
                    
                    printer.setTypeFontA();  
                    printer.bold(true);  
                    printer.setTextDoubleHeight();
                   printer.tableCustom([                               
                  { text:"#1241", align:"CENTER",bold:true},
                  { text:"TOGO", align:"CENTER",bold:true}
                 ]);

                     printer.setTextNormal();
                     printer.tableCustom([                               
                       { text:"jianyeruan", align:"LEFT",bold:true},         
                     { text:"Kitchen", align:"CENTER",bold:true},
                      { text:moment(tools.defaultDate()).format('LTS'), align:"RIGHT",bold:true}
                    ]);
                   
                      printer.println(lineChar2);
                      printer.setTypeFontA();  
                      printer.bold(true);  
                

                  
                  for(var i=0;i<1;i++){        
                        printer.tableCustom([                               
                            { text:"L1.Pock Over Rice L1.Pock Over", align:"LEFT",bold:true},
                            { text:" x 1", align:"CENTER",bold:true}
                         ]);
                          printer.setTextNormal();  
                          printer.bold(true);     
                          printer.println("(xxxxx) x 1");
                          printer.println("(xxxxx) x 1");
                          printer.println("(xxxxx) x 1");
                          printer.drawLine(); 
                        }
                        done(null, "");
                  }else{
                      done(null, data["printerName"]["name"]+" "+ipAddress+":"+port);
                  }      
               })
}
function sendTwo(req, res, next,data, done) {
  var lineChar2="================================================";
   var ipAddress=data["printerName"]["ipAddress"];
            var port=data["printerName"]["port"] || 9100;
            var type=data["printerName"]["type"] || "epson";
            tcpp.probe(ipAddress, port, function(err, available) {
             if(available){
                      printer.init({
                      type: type,
                      interface: '/dev/usb/lp0',
                      width: 48,
                      characterSet: 'SLOVENIA',
                      removeSpecialCharacters: false,            
                      replaceSpecialCharacters: true,            
                      extraSpecialCharacters:{'£':163},
                      lineChar: "-",    
                      ip: ipAddress,
                      port: port
                    });

                      console.log(data)
                    
                    printer.setTypeFontA();  
                    printer.bold(true);  
                    printer.setTextDoubleHeight();
                   printer.tableCustom([                               
                  { text:"#1241", align:"CENTER",bold:true},
                  { text:"TOGO", align:"CENTER",bold:true}
                 ]);

                     printer.setTextNormal();
                     printer.tableCustom([                               
                       { text:"jianyeruan", align:"LEFT",bold:true},         
                     { text:"Kitchen", align:"CENTER",bold:true},
                      { text:moment(tools.defaultDate()).format('LTS'), align:"RIGHT",bold:true}
                    ]);
                   
                      printer.println(lineChar2);
                      printer.setTypeFontA();  
                      printer.bold(true);  
                

                  
                  for(var i=0;i<1;i++){        
                        printer.tableCustom([                               
                            { text:"L1.Pock Over Rice L1.Pock Over", align:"LEFT",bold:true},
                            { text:" x 1", align:"CENTER",bold:true}
                         ]);
                          printer.setTextNormal();  
                          printer.bold(true);     
                          printer.println("(xxxxx) x 1");
                          printer.println("(xxxxx) x 1");
                          printer.println("(xxxxx) x 1");
                          printer.drawLine(); 
                        /*  printer.cut();
            printer.execute();
            printer.clear(); */
                        }
                        done(null, "");
                  }else{
                       done(null, type+" "+ipAddress+":"+port+ "|");
                  }      
               })
    
}
module.exports.printerKitchen=function(req, res, next,datas){

var  KitchenCount=datas.length;    
     
switch (KitchenCount){
    case 1: 
          async.parallel([
            async.apply(sendOne,req, res, next,datas[0])
            ], function (err,result) {
            if(err) return next(err)   

               return {"code":"0","message":result};
            
        });
       break;
    case 2:
         async.parallel([
            async.apply(sendOne,req, res, next,datas[0]),
            async.apply(sendOne,req, res, next,datas[1]),
            
        ], function (err,result) {
            if(err) return next(err)   
              // return {"code":"0","message":result};
          return {"code":"0","message":result};
            
        });
     break;
    case 3:
           async.parallel([
            async.apply(sendOne,req, res, next,datas[0]),
            async.apply(sendOne,req, res, next,datas[1]),
            async.apply(sendOne,req, res, next,datas[2]),
        ], function (err,result) {
            if(err) return next(err)   

              return {"code":"0","message":result};
            
        });
        break;
    case 4:
         async.parallel([
            async.apply(sendOne,req, res, next,datas[0]),
            async.apply(sendOne,req, res, next,datas[1]),
            async.apply(sendOne,req, res, next,datas[2]),
            async.apply(sendOne,req, res, next,datas[3]),
        ], function (err,result) {
            if(err) return next(err)   

              return {"code":"0","message":result};
            
        });

        break;    
     case 5:
           async.parallel([
            async.apply(sendOne,req, res, next,datas[0]),
            async.apply(sendOne,req, res, next,datas[1]),
            async.apply(sendOne,req, res, next,datas[2]),
            async.apply(sendOne,req, res, next,datas[3]),
            async.apply(sendOne,req, res, next,datas[4]),
        ], function (err,result) {
            if(err) return next(err)   

               return {"code":"0","message":result};
            
        });
        break;   
    default: 
        
        break;
}






}

module.exports.printerOrder=function(array,key){

}
module.exports.printerReceipt=function(array,key){

}
module.exports.unique5=function(array,key){
  var r = [];
  for(var i = 0, l = array.length; i < l; i++) {
    for(var j = i + 1; j < l; j++)
      if (array[i][key] === array[j][key])j = ++i;
      r.push(array[i]);
  }
  return r;
}
module.exports.upload = function(req, res, next) {
    var fold=req.token.merchantId;
    var photoPath=path.join(__dirname, 'public')+'/'+fold;
    mkdirp(photoPath, function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
    var form = new multiparty.Form({uploadDir:  photoPath});
    var  store={};
         store.success=true;
       form.parse(req, function(err, fields, files) {
        store.message=files;
        res.json(store);
     })

}

module.exports.upload = function(req, res, next,fileName) {
var fsImpl = new S3FS('amazondb', options);
var fold=getYearMonthDate();
fsImpl.exists(flod).then(function(files) {
        if(files){
            fsImpl.mkdirp(flod).then(function() {
               fsImpl=new S3FS('amazondb/'+flod, options);

            }) 
        }else{
              fsImpl=new S3FS('amazondb/'+flod, options);

        }
               var fileName=fileName || new Date().getTime();
               var readStream = fs.createReadStream(filePath);
               fsImpl.writeFile(fileName,readStream).then(function(){
                   console.log(reason);
               })
},function(reason) {
  console.log(reason);
        
});
/*    var fold=req.token.merchantId;
    var photoPath=path.join(__dirname, 'public')+'/'+fold;
    mkdirp(photoPath, function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
    var form = new multiparty.Form({uploadDir:  photoPath});
    var  store={};
         store.success=true;
       form.parse(req, function(err, fields, files) {
        store.message=files;
        res.json(store);
     })*/

}

function getYearMonthDate(dateStr){
var d=dateStr?new Date(dateStr):new Date();
var date=d.getDate();
date=date>=10?date:'0'+date;
var month=d.getMonth();
month=month>=10?month:'0'+month;
var year=d.getFullYear();
return ''+month+date+year;
}
/*   
  PersonModel.update({_id:_id},{$set:{name:'MDragon'}},function(err){});
Person.findByIdAndUpdate(_id,{$set:{name:'MDragon'}},function(err,person){
      console.log(person.name); //MDragon
    });

PersonSchema.virtual('name.full').set(function(name){
      var split = name.split(' ');
      this.name.first = split[0];
      this.name.last = split[1];
    });
    var PersonModel = mongoose.model('Person',PersonSchema);
    var krouky = new PersonModel({});
    krouky.name.full = 'krouky han';//会被自动分解
    console.log(krouky.name.first);//krouky
db.blog.update(
　　{"comments.author":"jun"},
　　{"$set":{"comments.$.author":"harry"}}    若数组有多个值，我们只想对其中一部分进行操作，就需要用位置或者定位操作符"$"  定位符职匹配第一个，会将jun的第一个评论的名字修改为harry。
)
db.user.update({"name":"jun12"},{"$set":{"email":"jun@126.com"}})
Thing.findOneAndUpdate({_id: key}, {$set: {flag: false}}, {upsert: true, "new": false}).exec(function(err, thing) {
    console.dir(thing);
});
   log.info(info);
       log.info(req.params.id);{ upsert: true }
       var id=req.params.id;
       
        users.findOneAndUpdate({"_id":id},{"permissions":info.permissions,"roles":info.roles},options,function (err, data) {
                          if (err) return next(err);
                            returnData.message=data;
                            res.json(returnData);
                      });
        */
