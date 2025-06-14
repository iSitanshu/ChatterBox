import { Message } from "../models/message.model.js";
import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

const create_room = asyncHandler( async (req, res) => {
    const {roomName, password, hostID} = req.body

    if ([roomName, password, hostID].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required");

    const existingRoom = await Room.findOne({roomName});

    if (existingRoom)
        throw new ApiError(409, "Room already exist");

    const room = await Room.create({
        roomName,
        password,
        hostID 
    })

    const createdRoom = await Room.findById(room._id).select(
        "-password -refreshToken"
    );

    if (!createdRoom)
        throw new ApiError(500, "Something went wrong while registering the user");
    
    const createMessage = await Message.create({
        room: room._id
    })

    return res.status(201).json(
        new ApiResponse(200, 
            {
                room: createdRoom
            }, 
            "Room created successfully"
        )
    );
})

const join_room = asyncHandler( async (req, res) => {
    const {userID, roomName, password} = req.body  

    const existingUser = await User.findById(userID)

    if (!existingUser) throw new ApiError(409, "Login to access the room");

    const existingRoom = await Room.findOne({
        roomName
    });

    if (!existingRoom)
        throw new ApiError(404, "Room not found or incorrect password");

    const isPasswordValid = await bcrypt.compare(password, existingRoom.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (userID === String(existingRoom.hostID)) {
        throw new ApiError(400, "User is the host of the room and cannot join as a participant");
    }

    if (existingRoom.users && existingRoom.users.includes(userID)) {
        throw new ApiError(409, "User has already joined the room");
    }

    existingRoom.users.push(userID);
    await existingRoom.save();

    return res.status(200).json(
        new ApiResponse(200, 
            existingRoom, 
            "User joined the room successfully"
        )
    );
})

const my_rooms = asyncHandler( async (req, res) => {
    const { hostID } = req.body;

    if(!hostID) throw new ApiError(400, "HostID is required");

    const user = await User.findOne({_id: hostID})
    if (!user) throw new ApiError(404, "User does not exist");

    const roomwithUserID = await Room.find({ hostID })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            roomwithUserID,
            "List of all channel created by this particular user"
        )
    )
})

const channels = asyncHandler( async(req, res) => {
    const { userID } = req.body;

    const user = await User.findOne({ _id: userID })
    if(!user) throw new ApiError(400, "user is required");

    const roomsWithUser = await Room.find({ users: { $elemMatch: { $eq: userID } } });
    
    return res.status(200).json(
        new ApiResponse(
            200,
            roomsWithUser,
            "List of all channels the user has joined"
        )
    );
})

const no_of_users = asyncHandler( async (req, res) => {
    const { roomName } = req.body;

    const room = await Room.find({roomName})
    if(!room) throw new ApiError(400, "Invalid Room Credintials");

    if (room.length === 0) throw new ApiError(404, "Room not found");

    const hostId = room[0].hostID.toString();
    const userIds = room[0].users.map(id => id.toString());
    userIds.push(hostId);

    // Fetch usernames for all userIds (including host)
    const users = await User.find({ _id: { $in: userIds } }).select("username _id");
    const usernames = users.map(user => ({ _id: user._id, username: user.username }));

    // Attach usernames to the room object for response
    room[0] = room[0].toObject();
    room[0].usernames = usernames;

    return res.status(200).json(
        new ApiResponse(
            200,
            room,
            "List of all channels the user has joined"
        )
    );

})

export { create_room, join_room, my_rooms, channels, no_of_users };