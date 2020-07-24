import { Schema, model } from 'mongoose'

const ChatSchema = new Schema({
    members: {
        user_id: String,
        vet_id: String
    },
    messages: [
        { from: String, body: String }
    ]

}, {
    timestamps: true
})

export default model('Chat', ChatSchema)
