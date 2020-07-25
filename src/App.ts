import express from 'express'
import cors from 'cors'
import mogoose from 'mongoose'
import path from 'path'

import { createServer, Server } from 'http'

import routes from './routes'
import socketIo = require('socket.io')

class App {
    public express: express.Application
    public server: Server
    private io: socketIo.Server
    private user_sockets: Array<{ user_id?: string, socket_id?: string }>
    private messages: Array<{ user_id: string, messages: [{ from?: string, body?: string }]}>

    constructor() {
        this.express = express()
        this.database()
        this.middlewares()
        this.sockets()
        this.listen()
        this.routes()
        this.view()
        this.user_sockets = []
        this.messages = []
    }

    private middlewares(): void {
        this.express.use(express.json())
        this.express.use(cors())
    }

    private database(): void {
        mogoose.connect('mongodb://localhost:27017/chat', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    private routes(): void {
        this.express.use(routes)
    }

    private sockets(): void {
        this.server = createServer(this.express)
        this.io = socketIo(this.server)
    }

    private view(): void {
        this.express.use(express.static(path.join(__dirname, 'public')))
    }

    private listen(): void {
        this.io.on('connection', (socket: socketIo.Socket) => {
            console.log(`A new user conected: ${socket.id}`)

            socket.on('register', (msg: string) => {
                const { user_id } = JSON.parse(msg)
                console.log(user_id)
                const registry = this.user_sockets.find(element => element.user_id === user_id)
                if (registry) {
                    console.log(this.messages)
                    registry.socket_id = socket.id
                    socket.emit('previous', JSON.stringify(this.messages[user_id]))
                } else {
                    this.user_sockets.push({ user_id: user_id, socket_id: socket.id })
                    this.messages.push({ user_id: user_id, messages: [{ from: '', body: '' }] })
                }
            })

            socket.on('message', (msg: string) => {
                const parsedMsg = JSON.parse(msg)

                const to_socket_id = this.user_sockets.find(element => element.user_id === parsedMsg.to_user_id)
                try {
                    this.messages[parsedMsg.user_id].messages.push({ from: parsedMsg.user_id, body: parsedMsg.msg })
                } catch (e) {

                }

                this.io.to(to_socket_id.socket_id).emit('received', { user_id: parsedMsg.user_id, msg: parsedMsg.msg })
            })

            socket.on('disconnect', () => {
                console.log('A user has leaved')
            })
        })
    }
}

export default new App()
