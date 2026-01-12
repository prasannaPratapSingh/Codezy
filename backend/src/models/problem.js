const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    problemType:{
        type:String,
        enum:['fullCode','function'],
        default:'fullCode'
    },


    tags: {
        type: String,
        enum: ['array', 'linkedList', 'graph', 'dp'],
        required: true
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

    driverCode:[
        {
            language:{
                type:String,
                required:true
            },
            header:{
                type:String,
                required:true
            },
            footer:{
                type:String,
                required:true
            }
        }
    ],

    functionMeta:{
        functionName:String,
        returnType:String,
        parameters:[String]
    },

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

    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    generatedBy:{
        type:String,
        default:"admin"
    }
}, {
    timestamps: true
})


const Problem = mongoose.model('problem', problemSchema);

module.exports = Problem;

