
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    


var sizesSchema = new mongoose.Schema({ 
    name:String,
	   order:{type:Number,default:100},
	   status:{type:String ,default:"true"},
	   mId:{type:String,uppercase: true, trim: true},
	   createdAt: {type:Date,default:Date.now()},
	   updatedAt: Date,	
      ls:{
         name:String,
        
    }
})

sizesSchema.index({ name: 1, status:1 }, { unique: true,sparse:true});
module.exports = mongoose.model('sizes', sizesSchema);
