import express from 'express'
import cors from 'cors'
import mogoose from 'mongoose'

import { createServer, Server } from 'http'

import routes from './routes'
import socketIo = require('socket.io')

class App {
    public express: express.Application
    public server: Server
    private io: socketIo.Server

    constructor() {
        this.express = express()
        this.database()
        this.middlewares()
        this.sockets()
        this.listen()
        this.routes()
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

    private listen(): void {
        this.io.on('connection', (socket: any) => {
            console.log('A new user conected')

            socket.on('message', (msg: string) => {
                console.log(`A new message arrived: ${msg}`)
            })

            socket.on('disconnect', () => {
                console.log('A user has leaved')
            })
        })
    }
}

export default new App()
