const express = require('express')
require('dotenv').config();
const app = express();

const isDev = process.env.NODE_ENV !== 'production';
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
const contestRouter = require('./routes/contest');

app.use(express.json());
app.use(cookieParser());

const passport = require('./config/passport');
app.use(passport.initialize());

const allowedOrigins = [
    "https://codezy.space",
    "https://www.codezy.space",
];

// Only allow localhost origins in development
if (isDev) {
    allowedOrigins.push("http://localhost:5173");
}

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});


//yeh saare route me websocket use karne ke liye
app.set('io', io);

//websocket connection yaha se saare listen karenge
io.on('connection', (socket) => {
    if (isDev) console.log('User Connected:', socket.id);

    //yeh saare problem-solve event ko listen karega
    socket.on('problem-solved', (data) => {
        if (isDev) console.log(`${data} just solved problem ${data.problemTitle}`);

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
        if (isDev) console.log('User Disconnected', socket.id)
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
app.use('/healthCheck', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is OK 💪🏻",
        environment: process.env.NODE_ENV || 'development'
    })
})

// Global error handler — only expose stack traces in development
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(isDev && { stack: err.stack })
    });
});

const InitalizeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        server.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Server listening at port: ${process.env.PORT || 3000}`);
            console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
            if (isDev) console.log(`🔗 http://localhost:${process.env.PORT || 3000}`);
        })
    }
    catch (err) {
        console.error("❌ Failed to initialize:", err.message);
        if (isDev) console.error(err.stack);
        process.exit(1);
    }
}

InitalizeConnection();

