import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../src/styles/Welcomescreen.css'

export default function WelcomeScreen() {
  const Navigate = useNavigate()
  return (
    <div className='welcomescreen-container'>
      <h1 className='welcome-title'>welcome to echo</h1>
      <p className='welcome-subtitle'>Chat with friends in any-time.</p>
      <div className='welcomescreen-container-top'>
        <div className='welcomescreen-container-top-1'>
          <p className='profile-circle-small-1'></p>
          <p className='chat-small'><span className='welcome-screen-chats'>hey! just joined</span></p>
        </div>
        <div className='welcomescreen-container-top-2'>
          <p className='profile-circle-large'></p>
          <p className='chat-large'><span className='welcome-screen-chats'>welcome ! loving the vibe here</span></p>
        </div>
        <div className='welcomescreen-container-top-3'>
          <p className='profile-circle-small-2'></p>
          <p className='chat-small'><span className='welcome-screen-chats'>let’s start chatting</span></p>
        </div>
      </div>
      <button className='welcome-screen-button' onClick={() => { Navigate('/login') }}>get started</button>
    </div>
  )
}