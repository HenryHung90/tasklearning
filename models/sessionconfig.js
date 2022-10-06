const mongoose = require('mongoose');

const sessionconfig = new mongoose.Schema({
    session: {
        type: 'string',
        required: true,
    },
    active: {
        type: 'boolean',
        required: true,
    }
})

module.exports = mongoose.model('sessionconfig', sessionconfig)