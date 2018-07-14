var mongoose = require('mongoose');
    Schema = mongoose.Schema;
     

var addressSchema = new Schema({
      address: String,
      apt:String,
      city: String,
      state: String,
      zipcode: String,
      description:String,
      updatedAt: Date,
      location: [{type:Array,default:[0,0]}]
     
});
var creditCardsSchema=new Schema({
   cardNo:String,
   holderName:String,
   expirationYear:String,
   expirationMonth:String,
   expires:String,
   ccv:String,
   cardType:String,
   updatedAt: Date,

})

var customersSchema = new mongoose.Schema({ 
    mId:{type:String,uppercase: true, trim: true},
    firstName:String,
    lastName:String,
    birthday:Date,
     addressInfo:[addressSchema],
    creditCards:[creditCardsSchema],
    phoneNum1:{type:String,trim: true},
    phoneNum2:String,
    email:{type:String,lowercase:true},
    password:String,
    facebook:String,
    wechat:String,
    twitter:String,
    password:String,
    createdAt: {type:Date,default:Date.now()},
    updatedAt: Date,
    description:String,
    status:{type:String, default: "true"},
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    user:String
    },
    sl:{
         description:String
    }
});
addressSchema.index({location:'2dsphere'})
customersSchema.index({ email: 1, mId: 1,status:1 }, { unique: true,sparse:true});
module.exports = mongoose.model('customers', customersSchema);

