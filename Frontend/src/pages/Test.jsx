import React, { useState } from 'react'
import socket from '../socket/socket.js'
import { useSelector } from 'react-redux'

const Test = () => {
    const [fell, setFell] = useState('fell')
    const user = useSelector((state) => state.user.user)
    const first = "Mishra"
    const [name, setName] = useState('')
    const socketHandle = () => {
        socket.emit('isTyping', first)
    }
    socket.on('User is Typing', (fullName) => {
        console.log("Full name is ",fullName)
        setName(fullName)
    })
    if(fell == 'fell') socket.off('User is Typing')
  return (
    <div>
        <button
        className='flex justify-center m-auto p-8 border-2 cursor-pointer'
        onClick={socketHandle}
        >Test</button>
        <button
        className='flex justify-center m-auto p-8 border-2 cursor-pointer'
        onClick={() => setFell('gell')}
        >Test2</button>
        <h1>Yeh raha naam back end se {name}</h1>
    </div>
  )
}

export default Test