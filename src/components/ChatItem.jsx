import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import '../styles/Chatitem.css'

export default function ChatItem({ chatId, user, existingChat }) {
  const [chatUser, setChatUser] = useState(null)
  const [chatData, setChatData] = useState(null)
  const { setSelectedUser } = useOutletContext()
  useEffect(() => {
    if (user) {
      setChatUser(user)
      return
    }
    if (!chatId || !auth.currentUser) return
    const ids = chatId.split('_')
    const otherUserId = ids.find(id => id !== auth.currentUser.uid)
    const getUser = async () => {
      const snap = await getDoc(doc(db, "USERS", otherUserId))
      if (snap.exists()) {
        setChatUser({ id: otherUserId, ...snap.data() })
      }
    }
    getUser()
    const unsubscribe = onSnapshot(doc(db, "CHATS", chatId), (snap) => {
      if (snap.exists()) {
        setChatData(snap.data())
      }
    })
    return () => unsubscribe()
  }, [chatId, user])

  useEffect(() => {
    if (existingChat && !chatData) {
      setChatData(existingChat)
    }
  }, [existingChat, chatData])

  if (!chatUser) return null
  const profile = chatUser.firstname?.[0]?.toUpperCase() + chatUser.secondname?.[0]?.toUpperCase()
  const unread = chatData?.unreadCount?.[auth.currentUser?.uid] || 0
  const lastMessageTime = chatData?.lastMessageTime ? new Date(chatData.lastMessageTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  }) : ''
  const handleClick = () => {
    if (existingChat && !chatData) {
      setSelectedUser({ ...chatUser, existingChatId: existingChat.id })
    } else if (chatId) {
      setSelectedUser(chatUser)
    } else {
      setSelectedUser(chatUser)
    }
  }

  return (
    <div className='Chat-item-container' onClick={handleClick}>
      <div className='Chat-item-container-left'>
        <p className='userprofile'>{profile}</p>
      </div>
      <div className='Chat-item-container-right'>
        <div className='Chat-item-container-right-top'>
          <p className='Chat-item-container-right-top-left'>{chatUser.username}</p>
          <p className='Chat-item-container-right-top-right'>{lastMessageTime}</p>
        </div>
        <div className='Chat-item-container-right-bottom'>
          <p className='Chat-item-container-right-bottom-left'>
            {chatData?.lastMessage || 'Start a conversation'}
          </p>
          {unread > 0 && (
            <p className='Chat-item-container-right-bottom-right'>{unread}</p>
          )}
        </div>
      </div>
    </div>
  )
}