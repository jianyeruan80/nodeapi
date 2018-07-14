  var mongoose = require('mongoose'),Schema = mongoose.Schema;
  
  permstempsSchema = new Schema({ 
  _id: String,
  name:String,
  status:{type:Boolean,default:false},
  url:String,
  order:Number,
  code:String,
  permName:String,//target="_blank
  permCode:String
});
  

module.exports = mongoose.model('permstemps', permstempsSchema);
