var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notepadsSchema = new Schema({
	    mId:{type:String,default:"M0000001"},
      title:{type:String},
      content:String,
      password:String,
      onlyUrl:String,
      createdAt: {type:Date,default:Date.now()},
      updatedAt: Date,
      operator:{
      id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
      user:String},
      sl:{
       name:String
      }

});
notepadsSchema.index({ mId: 1,title:1},{unique: true,sparse:true });
module.exports = mongoose.model('notepads', notepadsSchema);

