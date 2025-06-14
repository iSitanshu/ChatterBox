// models/Message.js
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
   messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      senderName: String,
      time: Date,
      content: String
    }
  ]
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema)