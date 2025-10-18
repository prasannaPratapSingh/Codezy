const express = require('express');
const aiRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')
const generateProblem=require('../controllers/generateProblem')
const sanitizeProblem=require('../controllers/sanitizeProblem')


aiRouter.post('/generate-problem',userMiddleware,generateProblem);
aiRouter.post('/sanitize-problem',userMiddleware,sanitizeProblem);


module.exports=aiRouter;