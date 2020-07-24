import express from 'express'
import cors from 'cors'
import mogoose from 'mongoose'

class ChatController {
    public express: express.Application

    constructor() {
        this.express = express()
        this.database()
        this.database()
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
        this.express.get('/chat', (req, res) => {
            console.log('Zuup! A new request arrived!')
            return res.send('Its all running, sir!')
        })
    }
}

export default new ChatController().express
