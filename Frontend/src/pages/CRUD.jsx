import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, LogIn, User, Video, Lock, Users as UsersIcon, Shield, Grid } from 'lucide-react';
import Navbar from '../components/Navbar';
import { changeCreateRoom, changeJoinRoom } from '../features/status/statusSlice';
import RoomDisplay from '../components/RoomDisplay';

const CRUD = () => {
  const rooms = useSelector((state) => state.user.user) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hostedRooms = rooms.filter(r => r.role === 'host');
  const memberRooms = rooms.filter(r => r.role === 'member');
  const [activeTab, setActiveTab] = useState('hosted');

  React.useEffect(() => {
    if (!rooms || rooms.length === 0) {
      navigate('/');
    }
  }, [rooms, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-gray-200">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 max-w-xl">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
            Connect Instantly
          </h2>
          <p className="text-gray-400 mb-6 text-lg">
            Secure, real-time communication with end-to-end encryption
          </p>
          <div className="flex flex-wrap gap-4">
            <button
            onClick={() => dispatch(changeCreateRoom())}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-5 py-3 rounded-lg shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </button>
            <button
            onClick={() => dispatch(changeJoinRoom())}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 px-5 py-3 rounded-lg shadow-lg transition-all duration-300"
            >
              <LogIn className="w-5 h-5" />
              Join Room
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Lists */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-50">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Video className="text-blue-400" />
                    Your Rooms
                  </h2>
                  <div className="flex border border-gray-600 rounded-lg bg-gray-900/50">
                    <button 
                      onClick={() => setActiveTab('hosted')}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'hosted' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} hover:cursor-pointer`}
                    >
                      Hosted
                    </button>
                    <button 
                      onClick={() => setActiveTab('member')}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'member' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} hover:cursor-pointer`}
                    >
                      Joined
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <RoomDisplay activeTab={activeTab} />
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <Shield className="text-cyan-400" />
                  Security Features
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/70 p-3 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-blue-900/30 p-2 rounded-md">
                        <Lock className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="ml-3 text-sm font-medium text-white">End-to-end encryption</h3>
                    </div>
                  </div>
                  <div className="bg-gray-800/70 p-3 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-cyan-900/30 p-2 rounded-md">
                        <Shield className="h-5 w-5 text-cyan-400" />
                      </div>
                      <h3 className="ml-3 text-sm font-medium text-white">Secure access</h3>
                    </div>
                  </div>
                  <div className="bg-gray-800/70 p-3 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-purple-900/30 p-2 rounded-md">
                        <UsersIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      <h3 className="ml-3 text-sm font-medium text-white">User controls</h3>
                    </div>
                  </div>
                  <div className="bg-gray-800/70 p-3 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-yellow-900/30 p-2 rounded-md">
                        <Grid className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h3 className="ml-3 text-sm font-medium text-white">Waiting room</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden p-6">
              <h3 className="text-lg font-medium text-white mb-4">Get started quickly</h3>
              <p className="text-gray-400 text-sm mb-4">
                Click <strong className="text-blue-400">New meeting</strong> to get a link you can share with participants
              </p>
              <button
                onClick={() => dispatch(changeCreateRoom())}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Create Instant Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Video className="h-5 w-5 text-blue-400 mr-2" />
              <span className="font-medium text-white">ChatterBox</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <div>© {new Date().getFullYear()} All rights reserved</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CRUD;