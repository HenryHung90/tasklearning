const mongoose = require('mongoose');

const missioncontentmodel = new mongoose.Schema({
    week: {
        type: 'string',
        required: true,
    },
    mission: {
        type: 'array',
        required: true,
    },
})

module.exports = mongoose.model('missioncontent', missioncontentmodel)