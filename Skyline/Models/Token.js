const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const Token = new Schema({
    token:String,
  },schemaOptions)

module.exports = mongoose.model('Token', Token)



