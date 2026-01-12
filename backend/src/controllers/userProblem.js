const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require('../models/solutionVideo');
const redisClient = require("../config/redis");

const createProblem = async (req, res) => {

  const { problemType,driverCode,
    visibleTestCases,
    referenceSolution
  } = req.body;


  try {

    for (const { language, completeCode } of referenceSolution) {

      const languageId = getLanguageById(language);

      // I am creating Batch submission

      let finalSourceCode;
      if(problemType==='function'){
        const driver=driverCode.find(data=>data.language===language);
        finalSourceCode=driver.header + "\n" + completeCode + "\n" + driver.footer;
      }
      else{
        finalSourceCode=completeCode;
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: finalSourceCode,
        language_id: languageId,
        stdin: problemType==='fullCode'?testcase.input:"",
        expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);

      console.log(testResult);
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("test cases nahi paas huye");
        }
      }
    }


    // We can store it in our DB

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id
    });

    await redisClient.del("problems:list:all");
    // const latestDoc = await Problem.findOne({}, { sort: { _id: -1 } });
    res.status(201).json({
      message: "Problem saved Successfully",
      probId: userProblem._id
    });
  }
  catch (err) {
    res.status(400).send("Nahi hua save db me save: " + err);
  }
}

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator
  } = req.body;

  try {
    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: "Missing ID field" });
    }

    if (!title || !description || !difficulty || !tags) {
      return res.status(400).json({ message: "Missing required fields: title, description, difficulty, or tags" });
    }

    if (!visibleTestCases || !Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({ message: "At least one visible test case is required" });
    }

    if (!hiddenTestCases || !Array.isArray(hiddenTestCases) || hiddenTestCases.length === 0) {
      return res.status(400).json({ message: "At least one hidden test case is required" });
    }

    if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length !== 3) {
      return res.status(400).json({ message: "Reference solution must contain exactly 3 languages" });
    }

    if (!startCode || !Array.isArray(startCode) || startCode.length !== 3) {
      return res.status(400).json({ message: "Start code must contain exactly 3 languages" });
    }

    // Check if problem exists
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found with the provided ID" });
    }

    // Validate all test cases before processing
    const allTestCases = [...visibleTestCases, ...hiddenTestCases];

    for (const testCase of allTestCases) {
      if (!testCase.input || !testCase.output) {
        return res.status(400).json({ message: "All test cases must have input and output" });
      }
    }

    // Validate reference solutions by testing them against all test cases

    for (const solution of referenceSolution) {
      const { language, completeCode } = solution;

      if (!language || !completeCode) {
        return res.status(400).json({
          message: `Missing language or complete code for ${language || 'unknown language'}`
        });
      }

      try {
        const languageId = getLanguageById(language);

        if (!languageId) {
          return res.status(400).json({
            message: `Unsupported language: ${language}`
          });
        }


        // Test against visible test cases
        const visibleSubmissions = visibleTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input.toString().trim(),
          expected_output: testcase.output.toString().trim()
        }));

        const visibleSubmitResult = await submitBatch(visibleSubmissions);

        if (!visibleSubmitResult || !Array.isArray(visibleSubmitResult)) {
          return res.status(500).json({
            message: `Failed to submit ${language} solution for visible test cases`
          });
        }

        const visibleResultTokens = visibleSubmitResult.map((result) => result.token);
        const visibleTestResults = await submitToken(visibleResultTokens);

        // Check visible test case results
        for (let i = 0; i < visibleTestResults.length; i++) {
          const test = visibleTestResults[i];
          if (test.status_id !== 3) { // 3 = Accepted
            console.log(`${language} solution failed on visible test case ${i + 1}:`, {
              status_id: test.status_id,
              status: test.status?.description,
              input: visibleTestCases[i].input,
              expected: visibleTestCases[i].output,
              actual: test.stdout
            });
            return res.status(400).json({
              message: `${language} reference solution failed on visible test case ${i + 1}. Status: ${test.status?.description || 'Unknown error'}`,
              details: {
                input: visibleTestCases[i].input,
                expected: visibleTestCases[i].output,
                actual: test.stdout,
                error: test.stderr
              }
            });
          }
        }

        // Test against hidden test cases
        const hiddenSubmissions = hiddenTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input.toString().trim(),
          expected_output: testcase.output.toString().trim()
        }));

        const hiddenSubmitResult = await submitBatch(hiddenSubmissions);

        if (!hiddenSubmitResult || !Array.isArray(hiddenSubmitResult)) {
          return res.status(500).json({
            message: `Failed to submit ${language} solution for hidden test cases`
          });
        }

        const hiddenResultTokens = hiddenSubmitResult.map((result) => result.token);
        const hiddenTestResults = await submitToken(hiddenResultTokens);

        // Check hidden test case results
        for (let i = 0; i < hiddenTestResults.length; i++) {
          const test = hiddenTestResults[i];
          if (test.status_id !== 3) { // 3 = Accepted
            console.log(`${language} solution failed on hidden test case ${i + 1}:`, {
              status_id: test.status_id,
              status: test.status?.description,
              input: hiddenTestCases[i].input,
              expected: hiddenTestCases[i].output,
              actual: test.stdout
            });
            return res.status(400).json({
              message: `${language} reference solution failed on hidden test case ${i + 1}. Status: ${test.status?.description || 'Unknown error'}`,
              details: {
                input: hiddenTestCases[i].input,
                expected: hiddenTestCases[i].output,
                actual: test.stdout,
                error: test.stderr
              }
            });
          }
        }


        console.log(`${language} solution passed all test cases ✓`);

      } catch (error) {
        console.error(`Error testing ${language} solution:`, error);
        return res.status(500).json({
          message: `Error while testing ${language} reference solution: ${error.message}`
        });
      }
    }

    console.log("All reference solutions validated successfully ✓");

    // Prepare update data
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      tags,
      visibleTestCases: visibleTestCases.map(tc => ({
        input: tc.input.toString().trim(),
        output: tc.output.toString().trim(),
        explanation: tc.explanation ? tc.explanation.trim() : ''
      })),
      hiddenTestCases: hiddenTestCases.map(tc => ({
        input: tc.input.toString().trim(),
        output: tc.output.toString().trim()
      })),
      startCode: startCode.map(sc => ({
        language: sc.language,
        initialCode: sc.initialCode || ''
      })),
      referenceSolution: referenceSolution.map(rs => ({
        language: rs.language,
        completeCode: rs.completeCode
      })),
      updatedAt: new Date()
    };

    // Only update problemCreator if provided and different
    if (problemCreator && problemCreator !== existingProblem.problemCreator) {
      updateData.problemCreator = problemCreator;
    }

    // Update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      updateData,
      {
        runValidators: true,
        new: true,
        lean: true // Return plain object instead of mongoose document
      }
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found after update" });
    }

    await redisClient.del("problems:list:all");

    console.log(`Problem "${updatedProblem.title}" updated successfully`);

    res.status(200).json({
      message: "Problem updated successfully",
      problem: updatedProblem
    });

  } catch (error) {
    console.error("Error in updateProblem:", error);

    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid problem ID format" });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Problem with this title already exists" });
    }

    res.status(500).json({
      message: "Internal server error while updating problem",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

const deleteProblem = async (req, res) => {

  const { id } = req.params;
  try {

    if (!id)
      return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem)
      return res.status(404).send("Problem is Missing");

    await redisClient.del("problems:list:all");

    res.status(200).send("Successfully Deleted");
  }
  catch (err) {

    res.status(500).send("Error: " + err);
  }
}


const getProblemById = async (req, res) => {

  const { id } = req.params;
  try {

    if (!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution hiddenTestCases generatedBy');

    // video ka jo bhi url wagera le aao

    if (!getProblem)
      return res.status(404).send("Problem is Missing");

    const videos = await SolutionVideo.findOne({ problemId: id });

    if (videos) {

      const responseData = {
        ...getProblem.toObject(),
        secureUrl: videos?.secureUrl || null,
        thumbnailUrl: videos?.thumbnailUrl || null,
        duration: videos?.duration || null
      }

      return res.status(200).send(responseData);
    }

    res.status(200).send(getProblem);

  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}

const getAllProblem = async (req, res) => {

  try {

    const key = "problems:list:all";
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.status(200).send(JSON.parse(cachedData));
    }

    const getProblem = await Problem.find({}).select('_id title difficulty tags generatedBy');

    if (getProblem.length == 0)
      return res.status(404).send("Problem is Missing");

    await redisClient.set(key, JSON.stringify(getProblem), {
      "EX": 60
    });

    res.status(200).send(getProblem);
  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}

const solvedAllProblembyUser = async (req, res) => {

  try {

    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags"
    });

    res.status(200).send(user.problemSolved);

  }
  catch (err) {
    res.status(500).send("Server Error");
  }
}

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId });

    if (ans.length == 0) {
      return res.status(200).send([]); // Return empty array instead of string, and add return
    }

    res.status(200).send(ans);

  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}




module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem };


