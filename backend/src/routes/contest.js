const express = require('express');
const contestRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {contestCreator, getContest, getContestById, runContestCode, submitContestCode } = require('../controllers/createContest');
const userMiddleware = require('../middleware/userMiddleware');

contestRouter.post('/create', adminMiddleware, contestCreator);
contestRouter.get('/all', userMiddleware, getContest);
contestRouter.get('/getContest/:id', userMiddleware, getContestById);
contestRouter.post('/run/:id', userMiddleware, runContestCode);
contestRouter.post('/submit/:id',userMiddleware,submitContestCode);
module.exports = contestRouter;


