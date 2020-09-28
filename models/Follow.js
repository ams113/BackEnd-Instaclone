const { Schema, model } = require('mongoose');

const followSchema = Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    follow: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }


});

module.exports = model('Follow', followSchema );