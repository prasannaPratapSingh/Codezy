const featureMiddleware = async (req, res, next) => {
    try {
        const currentUsage = req.user.specialFeature.specialUsage || 0;
        
        if(currentUsage >= 2){
            return res.status(403).json({
                error:"Session limit exceeded",
                usageCount:currentUsage,
                limit:2
            })
        }
        req.currentUsage = currentUsage;
        next();
    }
    catch (err) {
        res.status(401).send("Error: " + err.message)
    }
}

module.exports=featureMiddleware;