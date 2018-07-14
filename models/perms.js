  var mongoose = require('mongoose'),Schema = mongoose.Schema,
  permSchema = new Schema({ 
  name: String,
  code:String,//V,N,U,D,P,
  sl:{name:String}
});
  permsSchema = new Schema({ 
  name: String,
  code:String,
  default:{type:Boolean,default:false},
  perm:[permSchema],
  order:{type:Number,default:100},
  url:String,
  target:String,//target="_blank
  status:{type:String ,default:"true"},
  createdAt: {type:Date,default:Date.now},
  updatedAt: Date,
  sl:{name:String}
});
  
permsSchema.index({ code: 1 ,status:1}, { unique: true,sparse:true });
module.exports = mongoose.model('perms', permsSchema);
