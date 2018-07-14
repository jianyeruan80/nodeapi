var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
var optionsSchema = new mongoose.Schema({ 
    name:String,
    description:String,
    price:Number,
    picture:String,
    order:{type:Number,default:1},
    sl:{
         name:String,
         description:String
    }
   
});

var optionsGroupsSchema = new mongoose.Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    group:{type: "String",default:"Default"},
    description:String,
    minimun:{type:Number,default:0},
    maximun:{type:Number,default:0},
    order:{type:Number,default:1},
    options:[optionsSchema],
    sl:{
         group:String,
         name:String,
         description:String
    }
   
});*/
var groupsSchema = new mongoose.Schema({ 
    mId:{type:String,uppercase: true, trim: true},
    name:String,
    description:String,
    background:String,
    color:String,
    hidden:{type:Boolean,default:false},
    storeHours:[{type: mongoose.Schema.Types.ObjectId,null:true}], 
    status:{type:String,default:"true"},
    order:{type:Number,default:1},
    sl:{
         name:String,
         description:String
    },
    picture:{type:String},
    createdAt: {type:Date,default:Date.now()},
    updatedAt: Date,
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    user:String
},
   
});
groupsSchema.index({ name: 1, merchantId: 1 }, { unique: true,sparse:true});
module.exports = mongoose.model('groups', groupsSchema);
