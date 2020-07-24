import { Request, Response } from 'express'

import Chat from '../schemas/Chat'
class ChatController {
    public async index(req: Request, res: Response): Promise<Response> {
        const chats = await Chat.find({ members: [req.body.id] })

        return res.json(chats)
    }
}

export default new ChatController()
