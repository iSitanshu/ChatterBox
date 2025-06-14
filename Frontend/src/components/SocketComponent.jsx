import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "../features/user/userSlice";
import socket from "../socket/socket.js";

const SocketComponent = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.length > 0) {
      const username = user[0].username;
      socket.emit("user-connected", username);

      const handleOnlineUsers = (onlineUsersObject) => {
        const onlineUsernames = Object.keys(onlineUsersObject);
        dispatch(setOnlineUsers(onlineUsernames));
      };

      socket.on("no_of_online", handleOnlineUsers);

      return () => {
        if(!user) socket.disconnect();
      };
    }
  }, [user, dispatch]);

  return null;
};

export default SocketComponent;
