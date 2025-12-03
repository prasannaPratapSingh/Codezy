const mongoose = require('mongoose');
const { Schema } = mongoose;

const contestSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'live', 'completed', 'cancelled'],
        default: 'draft'
    },

    problemTitle: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        enum: ['array', 'linkedList', 'graph', 'dp'],
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            explanation: {
                type: String,
                required: true
            }
        }
    ],

    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            }
        }
    ],

    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],

    referenceSolution: [
        {
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true
            }
        }
    ],
    contestCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    generatedBy: {
        type: String,
        default: 'admin'
    }

}, {
    timestamps: true
})


const Contest = mongoose.model('contest', contestSchema);
module.exports = Contest;