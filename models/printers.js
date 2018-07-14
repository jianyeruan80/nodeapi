var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var printersSchema = new Schema({
	mId:{type:String,uppercase: true, trim: true},
      name:{type:String},
      ipAddress:{type:String},
      port:{type:String},
      description:String,
      order:{type:Number,default:1},
      status:{type: "String",default:"true"},
      printerType:{type:String},
      isPrinter:{type:Boolean,default:true},
      createdAt: Date,
      updatedAt: Date,
      operator:{id:{type: mongoose.Schema.Types.ObjectId, ref: 'admins' },user:String},
      sl:{
       name:String
      }

});
printersSchema.index({ mId: 1,name:1},{unique: true,sparse:true });
module.exports = mongoose.model('printers', printersSchema);

