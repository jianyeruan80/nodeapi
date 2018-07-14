var mongoose = require('mongoose'),Schema = mongoose.Schema;
var addressSchema = new Schema({
      address1: String,
      address2: String,
      apt:String,
      city: String,
      state: String,
      zipcode: String,
});
var adminsSchema = new Schema({
   email:{type:String,lowercase: true, trim: true},
   password:String,
   firstName:String,
   lastName:String,
   description:String,
   perms:[{type: Schema.Types.ObjectId, ref: 'permstemps' }],
   roles:[{ type:Schema.Types.ObjectId, ref: 'roles' }],
   middleName:String,
 
   phoneNum1:String,
   phoneNum2:String,
   birthday: Date,
   mId:{type:String,uppercase: true, trim: true},
   addressInfo:addressSchema,
   type:{type:String,default:""},//SUPER,ADMIN,""
   status:{type:String,default:"true"},
   createdAt: {type:Date,default:Date.now()},

   updatedAt: Date,
   operator:{
   id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
   user:String},
});
adminsSchema.index({email: 1,starus:1,mId:1}, { unique: true,sparse:true });
module.exports = mongoose.model('admins', adminsSchema);
