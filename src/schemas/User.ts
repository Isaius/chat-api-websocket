import { Schema, model, Document } from 'mongoose'

interface UserInterface extends Document {
    name: string,
    RG: number,
    address?: string
}

const UserSchema = new Schema({
    name: String,
    RG: Number,
    address: String
}, {
    timestamps: true
})

export default model<UserInterface>('User', UserSchema)
