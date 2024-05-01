import express from "express"
import { Server } from "socket.io"
import {createServer} from "http"
import cors from "cors"

const app = express()
const server = createServer(app)
const port = 3000


const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
        credentials: true
    }
});


app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello My World")
})

io.on("connection", (socket) => {
    console.log(`User Connected ${socket.id}`);
    // socket.emit("welcome", `Welcome to the server ${socket.id}`)   
    // .emit sirf apne client ko bhejta hai
    
    socket.broadcast.emit("welcome", `${socket.id} joined the server`)
    // .broadcast.emit apne client k elawa sb ko bhejta he

    socket.on("message", ({room, message}) => {
        io.to(room).emit("receive-message", message)
    })

    // message method se all clients ko real time message pohnch jaega

    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`user joined room ${room}`)
    })




    // socket.on("disconnect", ()=>{
        // console.log(`user disconneted ${socket.id})
    // })
    
});





server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
