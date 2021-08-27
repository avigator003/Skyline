const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const User = new Schema({
    name: String,
    userName: String,
    emailAddress: { type: String, unique: true },
    password: String,
    userPic: String,
    filepath: String,
    address: String,
    dateofbirth: Date,
    aniversary: Date,
    interests: String,
    contactPerson:String,
    admin: { type: Boolean, default: false },
    phoneNumber: String,
    blocked: { type: Boolean, default: false },
    verified: { type: Boolean, default: true },
}, schemaOptions)


// crypto.createHmac('sha1', 'secret')
//              .update('mypasswssord')
//              .digest('base64')


// create new User document
User.statics.create = function (password,
    name,
    emailAddress,
    phoneNumber,
    userPic,
    filepath,
    address,
    dateofbirth,
    aniversary,
    interests,
    contactPerson,
    admin) {

    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    const user = new this({
        name,
        emailAddress,
        password: encrypted,
        phoneNumber,
        userPic,
        filepath,
        address,
        dateofbirth,
        aniversary,
        interests,
        contactPerson,
        admin
    })

    // return the Promise
    return user.save()
}

// find one user by using username
User.statics.findOneByEmailAddress = function (emailAddress) {
    return this.findOne({
        emailAddress
    }).exec()
}

// verify the password of the User documment
User.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    console.log(this.password === encrypted)

    return this.password === encrypted
}

User.methods.assignAdmin = function () {
    this.admin = true
    return this.save()
}

module.exports = mongoose.model('User', User)