  var mongoose = require('mongoose'),Schema = mongoose.Schema,
   rolesSchema = new Schema({
   name: {type:String},
   description:String,
   perms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permstemps' }],
   order:{type:Number,default:1},
   status:{type:String ,default:"true"},
   mId:{type:String,uppercase: true, trim: true},
   createdAt: {type:Date,default:Date.now()},
   updatedAt: Date,
   operator:{
   id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
   user:String
 }
})
 
rolesSchema.index({ name: 1 ,mId:1,status:1}, { unique: true,sparse:true });

module.exports = mongoose.model('roles', rolesSchema);
