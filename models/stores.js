var mongoose = require('mongoose'), Schema = mongoose.Schema;
  addressSchema = new Schema({
    address: String,
      city: String,
      state: String,
      zipcode: String,
      description:String,
      sl:{
         description:String
    },
    location: []
}),
  deliveryFeeSchema = new mongoose.Schema({ 
  distance:Number,
  fee:Number
}) 
payMethodSchema = new mongoose.Schema({
  name:String,status:Boolean,
  key:String,ccv:String
})
orderTimeSchema = new mongoose.Schema({
week:[{value:Number,status:Boolean}],
startTime:String,
endTime:String,
status:{type:Boolean,default:true}
})
taxesSchema = new mongoose.Schema({
name:{type:String,default:"Sale Tax"},
taxRate:{type:Number,default:"0.08"},
ls:{
  name:String
}
})


storeHoursSchema = new mongoose.Schema({
name:String,
week:String,
startTime:String,
endTime:String,
ls:{
  name:String
}
})
var storesSchema = new mongoose.Schema({ 
    mId:{type:String,uppercase: true, trim: true},
    name:String,
    contact:String,
    addressInfo:addressSchema,
    phoneNum1:String,
    phoneNum2:String,
    webSite:String,
    email:String,
    password:String,
    about :String,
    createdAt: {type:Date,default:Date.now()},
    updatedAt: Date,
    logo:String,
    bgPic:String,
    fax:String,
    openTime:String,
    orderTime:[orderTimeSchema],
    isClose:{type:Boolean,default:false},
    payMethod:[payMethodSchema],	
    qrcUrl:{type:String,lowercase:true,default:""},
    minPrice:Number,
    waitTime:String,
    deliveryFee:[deliveryFeeSchema],
    deliveryFeeStatus:{type:Boolean,default:false},
    maxDistance:Number,
    diffTimes:{type:Number,default:0},
    taxes:[taxesSchema],
    storeHours:[storeHoursSchema],
    dualGallery:[],
    callGallery:[],
    gallery:[],
    dualTime:Number,
    callTime:Number,
    expires:Date,
    reportStartTime:Date,
    reportEndTime:Date,
    status:{type:String,default:"true"},
    licenseKey:String,
    sessionKey:[{type:String}],
    sl:{
      name:String
    },
    zoneTime:{type:Number,default:0},
    redeem:{
         pointsToDollar:Number, //Dollar redeemed for every point
         dollarToPoints:Number,//Points(s) earned for every dollar spent
         minPoints:Number,//最少多少点才能换
         auto:{type:Boolean,default:false}
    },
    operator:{
  id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
  user:String,
},
});
addressSchema.index({location:'2dsphere'})
storesSchema.index({mId:1,status:1},{unique: true,sparse:true });
module.exports = mongoose.model('stores', storesSchema);
