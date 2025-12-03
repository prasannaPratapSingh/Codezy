const mongoose = require('mongoose');
const { Schema } = mongoose;

const contestSubmissionSchema = new Schema({
    contestId: {
        type: Schema.Types.ObjectId,
        ref: 'contest',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    //ab yaha se contest ki information hogi
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error'],
        default: 'pending'
    },
    errorMessage: {
        type: String,
        default: ''
    },
    totalTestCases: {
        type: Number,
        default: 0
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    },
    memory: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    runtime: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const ContestSubmission = mongoose.model('contestuser', contestSubmissionSchema);
module.exports = ContestSubmission;
