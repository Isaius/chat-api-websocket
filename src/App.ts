import express from 'express'
import path from 'path'

import { createServer, Server } from 'http'

import socketIo = require('socket.io')

class App {
    public express: express.Application
    public server: Server
    private io: socketIo.Server
    private user_sockets: Array<{ user_id?: string, socket_id?: string }>
    private messages: Array<{ user_id: string, messages: [{ user_id?: string, msg?: string }]}>

    constructor() {
        this.express = express()
        this.middlewares()
        this.sockets()
        this.listen()
        this.view()
        this.user_sockets = []
        this.messages = []
    }

    private middlewares(): void {
        this.express.use(express.json())
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

                const registry = this.user_sockets.find(element => element.user_id === user_id)

                if (registry) {
                    registry.socket_id = socket.id

                    const user_history = this.messages.find(e => e.user_id === user_id)

                    socket.emit('previous', JSON.stringify(user_history.messages))
                } else {
                    this.user_sockets.push({ user_id: user_id, socket_id: socket.id })
                    this.messages.push({ user_id: user_id, messages: [{ user_id: '', msg: '' }] })
                }
            })

            socket.on('message', (message: string) => {
                const { user_id, to_user_id, msg } = JSON.parse(message)

                const to_socket_id = this.user_sockets.find(element => element.user_id === to_user_id)

                try {
                    const user_messages = this.messages.find(e => e.user_id === user_id)
                    user_messages.messages.push({ user_id: user_id, msg: msg })

                    const to_user_messages = this.messages.find(e => e.user_id === to_user_id)
                    to_user_messages.messages.push({ user_id: user_id, msg: msg })
                } catch (e) {
                    console.log('Fail to add msg to history')
                }

                this.io.to(to_socket_id.socket_id).emit('received', { user_id: user_id, msg: msg })
            })

            socket.on('disconnect', () => {
                console.log('A user has leaved')
            })
        })
    }
}

export default new App()
