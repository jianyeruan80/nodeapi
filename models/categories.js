var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    tools = require('../modules/tools');

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
    group:{type:String,default:"Default"},
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
   
});


var categoriesSchema = new mongoose.Schema({
    mId:{type:String,uppercase: true, trim: true},
    name:{type:String},
    startTime:String,
    endTime:String,
    group:{ type: mongoose.Schema.Types.ObjectId, ref: 'groups',null: true },
    optionGroups:[optionsGroupsSchema],
    description:String,
    status:{type:String,default:"true"},
    order:{type:Number,default:1},
    picture:{type:String},
    taxes:[{ type: mongoose.Schema.Types.ObjectId,null: true}],
    createdAt: {type:Date,default:Date.now()},
    updatedAt: Date,
    background:String,
    color:String,
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    user:String
},
    sl:{
         name:String,
         description:String
    }
});

categoriesSchema.index({ name: 1, mId: 1 ,status:1 }, { unique: true,sparse:true});
module.exports = mongoose.model('categories', categoriesSchema);
