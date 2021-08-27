const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const Element = new Schema({
    name:String,
    category:String,
    remarks:String,
    filepath:String,
    filename:String
  },schemaOptions)

module.exports = mongoose.model('Element', Element)



