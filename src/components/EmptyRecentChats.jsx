import React from 'react'
import ECHO_LOGO from '../../src/assets/icons/ECHO.png'
import '../styles/Emptyrecentchats.css'

export default function EmptyRecentChats() {
  return (
    <div className='Empty-recent-chats-container'>
      <img src={ECHO_LOGO} alt="ECHO" className='Empty-recent-chats-container-echo-logo' />
      <p className='Empty-recent-chats-message'>
        no conversation yet !
        <br />
        start a new chat and connect with people
      </p>
    </div>
  )
}
