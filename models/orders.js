var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ordersSchema = new Schema({
	    address:{type:String},
      deliveryTime:String,
      message:String,
      name:String,
       note:String,
        options:String,
         phone:String,
      orderId:String,   
      pickupTime:String,
      createdAt: {type:Date,default:Date.now()},
      updatedAt: Date,
      

});

module.exports = mongoose.model('orders', ordersSchema);

