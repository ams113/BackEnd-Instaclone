const { Schema, model } = require('mongoose');

const publicationSchema = Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User',
    },
    file: {
        type: String,
        trim: true,
        require: true,
    },
    typeFile: {
        type: String,
        trim: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = model('Publication', publicationSchema );