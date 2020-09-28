const { Schema, model } = require('mongoose');

const commentSchema = Schema({
    idPublication: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Publication'
    },
    idUser: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    comment: {
        type: String,
        trim: true,
        require: true,
    },
    createAt: {
        type: Date,
        default: Date.now()
    }

});



module.exports = model('Comment', commentSchema );