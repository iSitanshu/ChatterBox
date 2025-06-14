import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LoginPopup from './pages/LoginPopup'
import { useSelector } from 'react-redux'
import CRUD from './pages/CRUD'
import ProfileUser from './pages/ProfileUser'
import Create from './components/Create'
import Join from './components/Join'
import Channel from './pages/Channel'
import SocketComponent from './components/SocketComponent'

function App() {
  const status = useSelector((state) => state.status.currentstate)
  const checkCreate = useSelector((state) => state.status.createRoom)
  const checkJoin = useSelector((state) => state.status.joinRoom)
  const user = useSelector((state) => state.user.user)

  return (
    <div>
      {user && user.length !== 0 && <SocketComponent />}
      {status && <LoginPopup />}
      {checkCreate && <Create />}
      {checkJoin && <Join />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user' element={<CRUD />} />
        <Route path='/profile' element={<ProfileUser />} />
        <Route path='/user/channel' element={<Channel />} />
      </Routes>
    </div>
  )
}

export default App
