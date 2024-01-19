// Import packages
const express = require("express");
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Middlewares
const app = express();
app.use(express.json());

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        title: "Express Testing",
        message: "The app is working properly!",
    });
});

// Socket.IO Connection handling
let countUser = 0;
io.on('connection', (socket) => {
    console.log('A user connected');

    countUser++;
    io.emit('userCount', countUser);

    socket.on('MenssageNew', (obj) => {
        io.emit('Menssage-recibe', {
            obj,
            time: new Intl.DateTimeFormat("default", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            }).format(new Date()),
            countUser
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        countUser--;
        io.emit('userCount', countUser);
    });
});

// Connection
const port = process.env.PORT || 9001;
httpServer.listen(port, () => {
    console.log(`Express and Socket.IO server listening on port ${port}`);
});