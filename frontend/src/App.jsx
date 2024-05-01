import { useEffect, useMemo, useState } from "react"
import { io } from "socket.io-client"
import { Container, Typography, TextField, Button, Stack } from "@mui/material"

const App = () => {


  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [socketID, setSocketID] = useState("")
  const [messages, setMessages] = useState([])
  const [roomName, setRoomName] = useState("")

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id)
      console.log("connected", socket.id)
    })

    socket.on("receive-message", (data) => {
      console.log(data)
      setMessages((messages) => [...messages, data])
    })
    socket.on("welcome", (s) => {
      console.log(s)
    })
  }, [])

  const joinRoom = (e) => {
    e.preventDefault()
    socket.emit("join-room", roomName)
    setRoomName("")
  }

  const socket = useMemo(() => io("http://localhost:3000/"), [])

  const handleSubmit = (e) => {
    e.preventDefault()

    socket.emit("message", { message, room })
    setRoom("")
    setMessage("")
  }





  return (
    <Container maxWidth='sm'>
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoom}>
        <h3>Join Room</h3>
        <TextField value={roomName} id="outlined-basic" label="Room Name" variant="outlined" onChange={(e) => setRoomName(e.target.value)} />
        <Button type="submit" variant="contained" color="primary">Join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField value={message} id="outlined-basic" label="Message" variant="outlined" onChange={(e) => setMessage(e.target.value)} />
        <TextField value={room} id="outlined-basic" label="Room" variant="outlined" onChange={(e) => setRoom(e.target.value)} />
        <Button type="submit" variant="contained" color="primary">send</Button>
      </form>

      {messages.length > 0 ? (
        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div">{m}</Typography>
          ))}
        </Stack>
      ) : (
        <Typography>No Messages</Typography>
      )}

    </Container>


  )
}

export default App