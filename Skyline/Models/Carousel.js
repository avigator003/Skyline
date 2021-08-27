const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const Carousel = new Schema({
    image:[{filepath:String,filename:String}]
  },schemaOptions)

module.exports = mongoose.model('Carousel', Carousel)



