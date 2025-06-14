import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const generateAccesssAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required");

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser)
    throw new ApiError(409, "User with email or username already exist");

  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        user: createdUser,
      },
      "User registered successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError(400, "Username or Email is required");

  const user = await User.findOne({
    email,
  });

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(404, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccesssAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out"));
});

const client = new OAuth2Client(
  "672361942786-5g3ppa63m5ufuv37j7hefm8776ubf175.apps.googleusercontent.com"
);

const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "672361942786-5g3ppa63m5ufuv37j7hefm8776ubf175.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    res.status(200).json({
      message: "Login success",
      user: { email, name, picture, googleId },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

const authGoogle = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password)
    throw new ApiError(400, "Username or Email is required");

  const existingUser = await User.findOne({
    email,
  });

  if (!existingUser) {
    const user = await User.create({
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          user: createdUser,
        },
        "User registered successfully"
      )
    );
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(404, "Invalid user credentials");
 
  const { accessToken, refreshToken } = await generateAccesssAndRefreshTokens(
    existingUser._id
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );

});

export { registerUser, loginUser, logoutUser, googleLogin, authGoogle };
