import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hostID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

roomSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

export const Room = mongoose.model("Room", roomSchema)