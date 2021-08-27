const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const Terms = new Schema({
    terms:[{terms:String,index:Number}],
  },schemaOptions)

module.exports = mongoose.model('Terms', Terms)



