require("dotenv").config()
const WebSocket = require("ws")
const short = require("short-uuid")

const lambda = require(process.env.LAMBDA_PATH)
const connections = {}

const send = (connectionId, data) => {
  const connection = connections[connectionId]
  connection.send(data)
}

const defaultActions = {
  connect: (connection) => {
    const id = short.generate()
    connection.connectionId = id
    connections[id] = connection
    console.log(`Client connected with connectionId: ${id}`)
  },
  disconnect: (connectionId) => {
    delete connections[connectionId]
    console.log(`Client disconnected with connectionId: ${connectionId}`)
  },
  default: () => {},
}

const wss = new WebSocket.Server({ port: process.env.SOCKET_PORT })

wss.on("connection", (socket) => {
  defaultActions.connect(socket)
  socket.on("message", (data) => {
    const event = {
      body: JSON.stringify(data),
      requestContext: {
        connectionId: socket.connectionId,
      },
    }
    lambda.handler(event)
  })
  socket.on("close", () => {
    defaultActions.disconnect(socket.connectionId)
  })
})

console.log(`Socket listening on ws://localhost:${process.env.SOCKET_PORT}`)
