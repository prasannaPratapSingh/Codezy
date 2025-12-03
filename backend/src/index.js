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
const featureRouter = require('./routes/feature');
const http = require('http');
const { Server } = require('socket.io');
const contestRouter=require('./routes/contest');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://codezy-6y04.onrender.com',
    credentials: true
}))

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://codezy-6y04.onrender.com',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

//yeh saare route me websocket use karne ke liye
app.set('io', io);

//websocket connection yaha se saare listen karenge
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    //yeh saare problem-solve event ko listen karega
    socket.on('problem-solved', (data) => {
        console.log(`${data} just solved problem ${data.problemTitle}`);

        //problem solved ho jaane ke baad baaki sabko emit kardege us user ki information jisne problem solve kiya hai 
        socket.broadcast.emit('user-solved-problem', {
            username: data.username,
            problemTitle: data.problemTitle,
            problemId: data.problemId,
            difficulty: data.difficulty,
            timestamp: new Date().toISOString(),
            userId: data.userId
        })
    })

    //jab koi user diconnect hoga tab yeh event chalega 
    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
    })
})

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);
app.use('/profile', profileRouter);
app.use('/feature', featureRouter);
app.use('/contest', contestRouter);

const InitalizeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        server.listen(3000, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        })
    }
    catch (err) {
        console.log("Error: " + err);
    }
}

InitalizeConnection();

