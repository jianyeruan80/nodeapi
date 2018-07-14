var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var templatesSchema = new Schema({
	    mId:{type:String,uppercase: true, trim: true},
      name:{type:String},
      header:String,
      footer:String,
      description:String,
      order:{type:Number,default:1},
      status:{type: "String",default:"true"},
      createdAt: {type:Date,default:Date.now()},
      updatedAt: Date,
      operator:{
     id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
     user:String},
      sl:{
       name:String
      }

});
templatesSchema.index({ mId: 1,name:1},{unique: true,sparse:true });
module.exports = mongoose.model('templates', templatesSchema);

