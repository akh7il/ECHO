import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import EmptyChatDisplay from '../components/EmptyChatDisplay'
import Chatpanel from '../components/Chatpanel'
import Header from '../components/Header'
import '../styles/Home.css'
import '../styles/App.css'

export default function Home() {
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992)
  const fromLogin = sessionStorage.getItem("fromLogin")
  useEffect(() => {
    if (!fromLogin) {
      navigate("/login", { replace: true })
    }
  }, [navigate, fromLogin])
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  if (!fromLogin) return null
  const showRecentChats = !isMobile || !selectedUser

  return (
    <div className='Home-container'>
      <Header />
      <div className='chat-area'>
        {showRecentChats && <Outlet context={{ setSelectedUser }} />}
        {selectedUser ? (
          <Chatpanel user={selectedUser} setSelectedUser={setSelectedUser} />
        ) : (
          !isMobile && <EmptyChatDisplay />
        )}
      </div>
    </div>
  )
}