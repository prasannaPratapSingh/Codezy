const Contest = require('../models/contestSchema');
const ContestSubmission = require('../models/contestSubmissionSchema');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');


const contestCreator = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problemTitle, problemDescription, difficulty, tags, points, visibleTestCases, hiddenTestCases, startCode, status, referenceSolution
        } = req.body;

        if (!title || !description || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Title,description,startTime, and endTime are required'
            });
        }

        if (!problemTitle || !problemDescription || !difficulty || !tags || !points) {
            return res.status(400).json({
                success: false,
                message: 'Problem title, description, difficulty, tags, and points are required'
            })
        }

        const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join("-")}`
            });
        }
        //date ka logic
        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({
                success: false,
                message: 'End time must be after the start time'
            })
        }

        if (points < 0) {
            return res.status(400).json({
                success: false,
                message: 'Points must be a positive number'
            });
        }

        if (startCode.length === 3) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a start code!'
            })
        }



        const exists = await Contest.findOne({ title });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Contest with this name already exists'
            })
        }

        //---------------- All Validtion Checks Completed ----------------------

        const newContest = new Contest({
            title,
            description,
            startTime,
            endTime,
            problemTitle,
            problemDescription,
            difficulty,
            tags,
            points,
            visibleTestCases: visibleTestCases || [],
            hiddenTestCases: hiddenTestCases || [],
            startCode,
            referenceSolution,
            contestCreator: req.result._id,
            generatedBy: 'admin'
        });

        const savedContest = await newContest.save();

        res.status(201).json({
            success: true,
            message: 'Contest created successfully',
            contest: savedContest
        })

    } catch (error) {
        console.log('Error creating the contest', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

const getContest = async (req, res) => {
    try {
        const contest = await Contest.find().select('title description startTime endTime status problemTitle difficulty problemDescription tags points ');
        res.status(200).json({
            success: true,
            message: "Contest fetched successfully",
            contestDetails: contest
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch the contest " + error.message
        })
    }
}

const getContestById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("ID is missing!");
        }

        const getProblem = await Contest.findById(id).select('_id title description difficulty tags visibleTestCases startCode refernceSolution hiddenTestCases');

        if (!getProblem) {
            return res.status(404).send("Contest is Missing!");
        }
        res.status(200).send(getProblem);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch the contest by Id!",
        })
    }
}

const runContestCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const probId = req.params.id;
        let { code, language } = req.body;
        if (!userId || !probId || !code || !language) {
            return res.status(400).send("Some field Missing!");
        }

        const problem = await Contest.findById(probId);
        if (!problem) {
            return res.status(400).send("Problem not found!");
        }

        if (language === 'cpp') {
            language = 'c++'
        }

        let languageId = getLanguageById(language);

        //submitting to judge0 to uske liye submission batch banana padega 

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }))

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else {
                if (test.status_id == 4) {
                    status = false;
                    errorMessage = test.stderr;
                }
                else {
                    status = false;
                    errorMessage = test.stderr;
                }
            }
        }

        res.status(201).json({
            success: status,
            testCases: testResult,
            runtime,
            memory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error
        })
    }
}

const submitContestCode = async (req, res) => {
    try {
        const contestId = req.params.id;
        const userId = req.result._id;
        let { code, language } = req.body;

        const findContestUser = await ContestSubmission.findOne({ contestId, userId });
        if (findContestUser) {
            return res.status(400).send("Already participated in the Contest, wait for the RESULT!");
        }
        if (!contestId || !userId || !code || !language) {
            return res.status(400).send("Necessary field missing!");
        }

        //rest of the submission code...
        if (language === 'cpp') {
            language = 'c++'
        }

        const contestProblem = await Contest.findById(contestId);
        if (new Date(contestProblem.endTime).getTime() - new Date().getTime() <= 0) {
            return res.status(400).send("Time's Up!");
        }
        const contestSubmitted = await ContestSubmission.create({
            userId,
            contestId,
            code,
            language,
            testCasesTotal: contestProblem.hiddenTestCases.length
        })

        //now we will submit it to the judge0 to pehle humlog hiddentestcases ke through test karege code
        const languageId = getLanguageById(language);
        const submissions = contestProblem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }))
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else {
                if (test.status_id == 4) {
                    status = 'error';
                    errorMessage = test.stderr;
                }
                else {
                    status = 'wrong';
                    errorMessage = test.stderr;
                }
            }
        }
        const score = Math.round((testCasesPassed / contestProblem.hiddenTestCases.length) * contestProblem.points);


        //ab jo bhi result aaya hai usko save krdo jo upar document create kiya tha
        contestSubmitted.status = status;
        contestSubmitted.testCasesPassed = testCasesPassed;
        contestSubmitted.errorMessage = errorMessage;
        contestSubmitted.runtime = runtime;
        contestSubmitted.memory = memory;
        contestSubmitted.score = score;

        await contestSubmitted.save();

        res.status(201).json({
            status: status,
            totalTestCases: contestSubmitted.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory,
            problemTitle: contestProblem.problemTitle,
            contestName: contestProblem.title,
            score
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error(submission)" + error,
            error: error.message
        })
    }
}

const getLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findById(id).select("endTime");
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found!"
            });
        }

        const endDate = contest.endTime;

        if (new Date() < endDate) {
            return res.status(400).json({
                success: false,
                message: "Wait for the contest to finish to view the leaderboard."
            });
        }

        const submissions = await ContestSubmission.find({ contestId: id })
            .select("userId language status score runtime createdAt")
            .populate("userId", "firstName")
            .sort({ score: -1, runtime: 1, createdAt: 1 });

        if (submissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No leaderboard prepared for this contest."
            });
        }

        res.status(200).json({
            success: true,
            message: "Leaderboard fetched successfully",
            leaderboard: submissions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while preparing the leaderboard."
        });
    }
};


module.exports = { contestCreator, getContest, getContestById, runContestCode, submitContestCode, getLeaderboard };


