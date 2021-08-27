const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const SellVoucher = new Schema({
    package:{type:Schema.Types.ObjectId, ref:'Package'},
    packageNumber:Number,
    sellTo:{type:Schema.Types.ObjectId, ref:'User'},
    sellDate:Date,
    approved:{type:Boolean,default:false},
    elementConsumed:[{element:{type:Schema.Types.ObjectId, ref:'Element'},consumedDate:Date,otp:String}]
     },schemaOptions)

module.exports = mongoose.model('SellVoucher', SellVoucher)



