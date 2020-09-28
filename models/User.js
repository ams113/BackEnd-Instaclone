
const { Schema, model } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String, 
        required: true,
        trim: true,
        unique:true,
    },
    email: {
        type: String, 
        required: true,
        trim: true,
        unique:true,
    },
    avatar: {
        type: String, 
        trim: true,

    },
    siteWeb: {
        type: String, 
        trim: true,
    },
    description: {
        type: String, 
        trim: true,
    },
    password: {
        type: String, 
        required: true,
        trim: true,
    },
    createAt: {
        type: Date, 
        default: Date.now,
    },
    
});


module.exports = model('User', userSchema );