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
    sourceCode: {
        type: String,
        required: true
    },
    testCaseResults: [{
        testCaseType: {
            type: String,
            enum: ['visible', 'hidden'],
            required: true
        },
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: {
            type: Boolean,
            required: true
        },
        executionTime: Number,
        memoryUsed: Number,
        errorMessage: String
    }],
    totalTestCases: {
        type: Number,
        default: 0
    },
    passedTestCases: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },

    isAccepted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})