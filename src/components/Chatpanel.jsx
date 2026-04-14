import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import send_message from '../../src/assets/icons/send.png'
import arrow from '../../src/assets/icons/arrow-white.png'
import '../styles/Chatpanel.css'

export default function Chatpanel({ user, setSelectedUser }) {
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [chatId, setChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const chatAreaRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/')
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!auth.currentUser || !user) return
    const sender_id = auth.currentUser.uid
    const receiver_id = user.id
    const newChatId = [sender_id, receiver_id].sort().join('_')
    setChatId(newChatId)

    const initializeChat = async () => {
      const chatRef = doc(db, "CHATS", newChatId)
      const chatSnap = await getDoc(chatRef)
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [sender_id, receiver_id],
          lastMessage: "",
          lastMessageTime: new Date().toISOString(),
          unreadCount: {
            [sender_id]: 0,
            [receiver_id]: 0
          }
        })
      }
    }
    initializeChat()
  }, [user])

  useEffect(() => {
    if (!chatId) return
    const messagesRef = collection(db, "CHATS", chatId, "MESSAGES")
    const q = query(messagesRef, orderBy("time"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [chatId])

  useEffect(() => {
    if (!chatId || !auth.currentUser) return
    const messagesRef = collection(db, "CHATS", chatId, "MESSAGES")
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      snapshot.docs.forEach(async (docSnap) => {
        const msg = docSnap.data()
        if (msg.senderId !== auth.currentUser.uid && !msg.read) {
          await updateDoc(docSnap.ref, { read: true })
        }
      })
    })
    return () => unsubscribe()
  }, [chatId])

  useEffect(() => {
    const resetUnreadCount = async () => {
      if (!chatId || !auth.currentUser) return
      const chatRef = doc(db, "CHATS", chatId)
      const chatSnap = await getDoc(chatRef)
      if (chatSnap.exists() && chatSnap.data()?.unreadCount?.[auth.currentUser.uid] > 0) {
        await updateDoc(chatRef, {
          [`unreadCount.${auth.currentUser.uid}`]: 0
        })
      }
    }
    resetUnreadCount()
  }, [chatId])

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }, [messages])

  const sentMessage = async () => {
    if (!message.trim() || !chatId) return
    const sender_id = auth.currentUser.uid
    const receiver_id = user.id
    const messagesRef = collection(db, "CHATS", chatId, "MESSAGES")
    await addDoc(messagesRef, {
      senderId: sender_id,
      message: message.trim(),
      time: new Date().toISOString(),
      date: new Date().toDateString(),
      read: false
    })
    const chatRef = doc(db, "CHATS", chatId)
    const chatSnap = await getDoc(chatRef)
    const currentUnreadCount = chatSnap.data()?.unreadCount || {
      [sender_id]: 0,
      [receiver_id]: 0
    }
    await updateDoc(chatRef, {
      lastMessage: message.trim(),
      lastMessageTime: new Date().toISOString(),
      [`unreadCount.${receiver_id}`]: (currentUnreadCount[receiver_id] || 0) + 1
    })

    setMessage("")
  }
  const user_profile = user?.firstname?.[0]?.toUpperCase() + user?.secondname?.[0]?.toUpperCase()

  return (
    <div className='chat-panel-container'>
      <div className='chat-panel-container-head'>
        <img
          src={arrow}
          alt="back"
          className='chat-panel-container-head-arrow'
          onClick={() => setSelectedUser(null)} />
        <div className='chat-panel-container-head-user-details'>
          <div className='user-profile'>{user_profile}</div>
          <div className='chat-panel-container-head-user-info'>
            <p className='chat-panel-container-head-user-info-username'>
              {user.username}
            </p>
          </div>
        </div>
      </div>
      <div className='chat-panel-container-chat-area' ref={chatAreaRef}>
        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser.uid
          return (
            <div key={msg.id}
              className={`messages ${isMe ? 'sent' : 'received'}`}>
              <div className='message-box'>
                <p className='message'>{msg.message}</p>
                <p className='message-time'>
                  <span className='day'>
                    {new Date(msg.time).toDateString() === new Date().toDateString() ? 'Today' :
                      new Date(msg.time).toDateString() === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' :
                        `${new Date(msg.time).getDate().toString().padStart(2, '0')}-${(new Date(msg.time).getMonth() + 1).toString().padStart(2, '0')}-${new Date(msg.time).getFullYear()}`
                    }
                  </span>
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className='chat-panel-container-bottom'>
        <div className='enter-message-box'>
          <textarea
            value={message}
            className='enter-message'
            placeholder='Message'
            onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button
          className='send-message'
          disabled={!message.trim()}
          onClick={sentMessage}>
          <img src={send_message} alt="send" className='send-icon' />
        </button>
      </div>
    </div>
  )
}