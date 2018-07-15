var mongoose = require('mongoose');

var datasSchema = new mongoose.Schema({
   title:String,
   content:String,
   mId:{type:String,uppercase: true, trim: true},
   status:{type:String,default:"true"},
   active:{type:Boolean,defalut:true},
   createdAt: {type:Date,default:Date.now()},
   updatedAt: Date
   
});
module.exports = mongoose.model('otherads', datasSchema);
