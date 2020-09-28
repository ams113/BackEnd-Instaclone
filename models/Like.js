const { Schema, model } = require('mongoose');

const likeSchema = Schema({
    idPublication: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Publication',
    },
    idUser: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User',
    },
});

module.exports = model('Like', likeSchema );