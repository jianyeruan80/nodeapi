
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    tools = require('../modules/tools');


var optionsSchema = new mongoose.Schema({ 
    name:String,
  
    description:String,
    item:{ type: mongoose.Schema.Types.ObjectId, ref: 'items',null: true },
    price:Number,
    picture:String,
    printer:{
       type: mongoose.Schema.Types.ObjectId, ref: 'printers',null: true
    },
    order:{type:Number,default:1},
    sl:{
         name:String,
         description:String
    }
});

var optionsGroupsSchema = new mongoose.Schema({ 
    merchantId:{type:String,uppercase: true, trim: true},
    group:{type: String,default:"Default"},
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
var sizesSchema = new mongoose.Schema({ 
      name:{ type: mongoose.Schema.Types.ObjectId, ref: 'sizes'},
      price:Number,
      otherPrice:{type:Number,default:null}, 
      type:{ type: mongoose.Schema.Types.ObjectId, ref: 'ordertypes'},  //Dine in ,to go pu All
      ls:{
         name:String,
        
    }
})
var defaultOptionsSchema = new mongoose.Schema({ 
    name:String,
    description:String,
    price:Number,
    picture:String,
    order:{type:Number,default:1},
    printer:{ type: mongoose.Schema.Types.ObjectId, ref: 'printers',null: true },
    qty:{type:Number,default:1},
    sl:{
         name:String
        
    }
});


var itemsSchema = new mongoose.Schema({ 
    mId:{type:String,uppercase: true, trim: true},
    name:{type:String},
    optionGroups:[optionsGroupsSchema],
    background:String,
    color:String,
    status:{type:String,default:"true"},
    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'categories',null: true },
    price:Number,
    otherPrice:{type:Number,default:null},
    picture:{type:String},
    galleries:[{"order":Number,"name":String,"url":String,"description":String}],
    description:String,
    order:{type:Number,default:1},
    originPrice:Number,
    itemType:{type:String,default:"Item"},//Combo//Seat
    priceType:String, //Piece,unitPrice:{type:Boolean,default:false}, /openPrice:{type:Boolean,default:false},
    outOfStock:{type:Boolean,default:false},
    recommend:{type:Boolean,default:false},
    spicy:{type:Boolean,default:false},
    comboOnly:{type:Boolean,default:false},
    sizes:[sizesSchema],
    createdAt: {type:Date,default:Date.now()},
    updatedAt: Date,
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    user:String
},
    sl:{
         name:String,
         description:String
    }
});
itemsSchema.index({ name: 1, mId: 1,category:1,status:1 }, { unique: true,sparse:true});
module.exports = mongoose.model('items', itemsSchema);
