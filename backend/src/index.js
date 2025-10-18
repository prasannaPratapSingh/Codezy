const express = require('express')
const app = express();
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require('./routes/submit');
const cors = require('cors');
const aiRouter = require('./routes/generateAi');
const videoRouter = require('./routes/videoCreator');
const profileRouter = require('./routes/profile');
const featureRouter=require('./routes/feature');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'https://final-code-frontend.onrender.com',
    credentials: true,
    sameSite: 'none',
    secure: true
}))

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);
app.use('/profile', profileRouter);
app.use('/feature',featureRouter);


const InitalizeConnection = async () => {
    try {

        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        app.listen(3000, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        })

    }
    catch (err) {
        console.log("Error: " + err);
    }
}


InitalizeConnection();

