var config = require('./config');
const uri='mongodb://' + config.dbIpAddress + ':' + config.dbPort + '/'+config.dbData;
var options = {
  
  //db: { native_parser: true },
  //server: { poolSize: 5 }
  poolSize: 5
  
  //user: 'myUserName',
  //pass: 'myPassword'
}
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(uri, options).then(
  () => {console.log(uri)},
  err => {console.log(err) }
);
module.exports=mongoose;
