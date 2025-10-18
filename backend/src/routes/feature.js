const express=require('express');
const featureRouter=express.Router()
const userMiddleware=require('../middleware/userMiddleware');
const featureMiddleware=require('../middleware/featureMiddleware');
const featureFunction=require('../controllers/featureFunction');
featureRouter.post('/check',userMiddleware,featureMiddleware,featureFunction);

module.exports=featureRouter;