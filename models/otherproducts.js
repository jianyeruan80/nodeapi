var mongoose = require('mongoose'),Schema = mongoose.Schema;

var datasSchema = new Schema({
   code:{type:String,lowercase: true, trim: true},
   name:String,
   slName:String,
   regDate:String,
   price:Number,
   orderDate:String,
   orderDesc:String,
   recommend:{type:Boolean,default:false},
   desc:String,
   status:{type:String,default:"true"},
   createdAt: {type:Date,default:Date.now()},

   updatedAt: Date,
   mId:{type:String,uppercase: true, trim: true},

});
datasSchema.index({code: 1,starus:1,mId:1}, { unique: true,sparse:true });
module.exports = mongoose.model('otherproducts', datasSchema);
