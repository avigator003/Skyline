const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const Package = new Schema({
    packageName:String,
    uniqueSerialId:Number,
    packageNumbers:Number,
    filepath:String,
    filename:String,
    Element:[{element:{type:Schema.Types.ObjectId, ref:'Element'},validity:Number,quantity:Number,period:Number,remarks:String}],
    packageRemarks:String 
  },schemaOptions)

module.exports = mongoose.model('Package', Package)



