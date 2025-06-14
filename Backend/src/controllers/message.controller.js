import { Message } from "../models/message.model.js";
import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const add_to_message = asyncHandler(async (req, res) => {
  const { roomID, userID, content } = req.body;

  const user = await User.findById(userID);
  if (!user) throw new ApiError(404, "User does not exist");

  const room = await Room.findById(roomID)
  if(!room) throw new ApiError(404, "Room not found or incorrect password");

  const message = await Message.findOne({room: roomID})
  if(!message) throw new ApiError(404, "No message found in the database for the specified room");

 message.messages.push({
    sender: userID,
    senderName: user.username,
    time: new Date(),
    content: content
  });

  await message.save();

  return res.status(200).json(
    new ApiResponse(200, message, "Message added to the room successfully")
  );
});

const previousMessages = asyncHandler( async (req, res) => {
  const { roomID } = req.body;

  const message = await Message.find({room: roomID})
  if(!message) throw new ApiError(404, "No message found in the database for the specified room");

  if (!message[0] || !Array.isArray(message[0].messages) || message[0].messages.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No previous messages found")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, message[0].messages, "Previous messages fetched successfully")
  );
})

export { add_to_message, previousMessages };