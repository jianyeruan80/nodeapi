var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var countersSchema = new Schema({
   id:String,
  sequence_value:Number
})
     

countersSchema.index({ id: 1}, { unique: true,sparse:true});
module.exports = mongoose.model('counters', countersSchema);

