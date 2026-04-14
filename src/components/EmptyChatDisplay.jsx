import React from 'react'
import ECHO_LOGO from '../assets/icons/ECHO.png'
import '../styles/Emptychatdisplay.css'

export default function EmptyChatDisplay() {
  return (
    <div className='empty-chat-display-container'>
      <img src={ECHO_LOGO} alt="ECHO" className='echo-logo' />
      <p className='echo-logo-name'>echo</p>
      <p className='sub-head'>stay connected in real time</p>
    </div>
  )
}
