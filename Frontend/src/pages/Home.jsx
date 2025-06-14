import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeStatus } from '../features/status/statusSlice'
import { MessageCircle, Users, Lock } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import Profile from '../components/Profile'
import Navbar from '../components/Navbar'


const features = [
  {
    icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
    title: "Real-Time Messaging",
    description: "Messages are delivered instantly using WebSockets with no refresh needed.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Typing Indicators",
    description: "Know when someone is typing and be part of an active conversation.",
  },
  {
    icon: <Lock className="w-8 h-8 text-purple-600" />,
    title: "Private Chats",
    description: "Send direct messages securely to online users in private rooms.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Assuming user info is stored as an array in state.user.user; if not adjust accordingly.
  const user = useSelector((state) => state.user.user);

  const handleLoginStatus = () => {
    dispatch(changeStatus());
  };

  const handleGetStarted = () => {
    if (user && user.length > 0) {
      navigate('/user');
    } else {
      dispatch(changeStatus());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <Navbar />
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold mb-6">Connect. Chat. Collaborate.</h2>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
          ChatterBox is a blazing fast real-time chat app with live presence, private messaging, typing indicators, and more.
        </p>
        <button 
          onClick={handleGetStarted} 
          className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg font-semibold rounded-xl shadow">
          Get Started Now
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform">
              <div className="mb-4">{feat.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-400">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 text-sm">
        © {new Date().getFullYear()} ChatterBox. Built with ❤️ using React & TailwindCSS.
      </footer>
    </div>
  );
}

export default Home;