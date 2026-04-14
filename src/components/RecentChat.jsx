import React, { useEffect, useState } from 'react'
import { auth, db } from '../services/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import ChatItem from './ChatItem'
import '../styles/Recentchat.css'

export default function RecentChat() {
  const navigate = useNavigate()
  const [currentuser, setCurrentUser] = useState(null)
  const [recentChats, setRecentChats] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/')
      } else {
        setCurrentUser(currentUser.uid)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!currentuser) return
    const q = query(collection(db, "CHATS"), where("participants", "array-contains", currentuser))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => {
        const chatData = doc.data()
        const participants = chatData.participants
        const otherUserId = participants.find(id => id !== currentuser)
        return {
          chatId: doc.id,
          otherUserId: otherUserId,
          lastMessage: chatData.lastMessage,
          lastMessageTime: chatData.lastMessageTime,
          unreadCount: chatData.unreadCount?.[currentuser] || 0
        }
      })
      chats.sort((a, b) => {
        if (!a.lastMessageTime) return 1
        if (!b.lastMessageTime) return -1
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      })
      setRecentChats(chats)
    })
    return () => unsubscribe()
  }, [currentuser])

  return (
    <div className='Recent-chat-container'>
      {recentChats.map(chat => (
        <ChatItem key={chat.chatId} chatId={chat.chatId} />
      ))}
    </div>
  )
}