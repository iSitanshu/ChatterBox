import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { Send, PlusCircle, Paperclip, Smile, Mic, Menu } from "lucide-react";
import axios from "axios";
import socket from "../socket/socket.js";

const Channel = () => {
  const room = useSelector((state) => state.room.room);
  const roomId = useSelector((state) => state.room.roomID);
  const user = useSelector((state) => state.user.user);
  const onlineUsers = useSelector((state) => state.user.online);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [usercount, setUsercount] = useState(null);
  const [totalMember, setTotalMember] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);

  // Mobile sidebar toggle: false by default on small screens
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch room info
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await axios.post("/api/v1/room/no_of_user", {
          roomName: room,
        });
        const data = response.data.data[0];
        setUsercount(data.users.length + 1);
        const usernames = data.usernames.map((u) => u.username);
        setTotalMember(usernames);
        const onlineMembersUsernames = usernames.filter((username) =>
          onlineUsers.includes(username)
        );
        setOnlineMembers(onlineMembersUsernames);
      } catch (error) {
        console.error("Failed to fetch room info:", error);
      }
    };

    if (room) {
      fetchRoomInfo();
    }
  }, [room, onlineUsers]);

  // Fetch previous messages
  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.post("/api/v1/message/previous_message", {
        roomID: roomId,
      });
      const messagesData = response.data.data;
      const formattedMessages = messagesData.map((msg, idx) => ({
        id: msg._id || idx + 1,
        user: msg.senderName,
        text: msg.content,
        time: new Date(msg.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch previous messages:", error);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchPreviousMessages();
    }
  }, [roomId]);

  // Listen for socket trigger to reload messages
  useEffect(() => {
    socket.on("triggerPreviousMess", () => {
      fetchPreviousMessages();
    });
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await axios.post("/api/v1/message/add_to_message", {
        roomID: roomId,
        userID: user[0]._id,
        content: message,
      });

      setMessage("");
      socket.emit("message-sent", roomId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Navbar />

      {/* Mobile Header: displays only on small screens */}
      <div className="md:hidden flex items-center p-3 bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-lg font-bold">{room || "General Channel"}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: visible on md+ or if showSidebar is true on mobile */}
        <div
          className={`
            bg-gray-800 border-r border-gray-700 flex flex-col h-full 
            ${showSidebar ? "w-64 block" : "hidden"} md:block md:w-64 absolute md:relative z-20
          `}
        >
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold truncate">
              {room || "General Channel"}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {usercount || 0}, {onlineMembers.length} online
            </p>
          </div>

          <div className="p-3 flex items-center justify-between border-b border-gray-700">
            <h2 className="text-sm font-semibold text-gray-400">MEMBERS</h2>
            <button className="text-gray-400 hover:text-white">
              <PlusCircle size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {totalMember.map((member, index) => (
              <div
                key={member + index}
                className="flex items-center px-4 py-2 hover:bg-gray-700/50 cursor-pointer"
              >
                <div className="relative mr-3">
                  <div className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                    {member.charAt(0)}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-gray-800 ${
                      onlineMembers.includes(member)
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{member}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {onlineMembers.includes(member) ? "online" : "offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex items-center">
            <div className="relative mr-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full p-1">
                <div className="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
                  {user[0]?.username?.charAt(0) || "Y"}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-gray-800"></div>
            </div>
            <div>
              <p className="text-sm font-medium">
                {user[0]?.username || "Your Name"}
              </p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            showSidebar ? "ml-64" : "ml-0"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-900/80">
            {messages.map((msg, index) => {
              const isCurrentUser = msg.user === user[0]?.username;
              const uniqueKey = msg.id || `${msg.user}-${msg.time}-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={`mb-4 flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800 text-white rounded-bl-none"
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-bold text-blue-300 mb-1">
                        {msg.user}
                      </p>
                    )}
                    <p>{msg.text}</p>
                    <p className="text-xs text-gray-400 text-right mt-1">
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area: occupies full width */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center">
              <div className="flex space-x-2 mr-3">
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
                  <Paperclip size={18} />
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
                  <Smile size={18} />
                </button>
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message #${room || "general"}`}
                  className="w-full bg-gray-700 text-white rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-24"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 bottom-3 text-gray-400 hover:text-blue-400"
                >
                  <Send size={18} />
                </button>
              </div>
              <button className="ml-3 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
                <Mic size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;
