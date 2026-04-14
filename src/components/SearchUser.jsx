import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import ChatItem from './ChatItem'
import EmptyRecentChats from './EmptyRecentChats'
import search from '../assets/icons/search.png'
import CLOSE_WHITE from '../assets/icons/close-white.png'
import '../styles/Searchuser.css'

export default function SearchUser() {
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)
  const [userfound, setUserfound] = useState(true)
  const [users, setUsers] = useState([])
  const handleinput = async (e) => {
    const searchTerm = e.target.value.trim()
    if (searchTerm === "") {
      setSearching(false)
      setUsers([])
      setUserfound(true)
      return
    }
    setSearching(true)
    try {
      const currentUserId = auth.currentUser?.uid
      if (!currentUserId) return
      const username = searchTerm.toLowerCase()
      const q = query(
        collection(db, 'USERS'),
        where('username', '>=', username),
        where('username', '<=', username + '\uf8ff')
      )
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
          .filter(user => user.id !== currentUserId)
        if (results.length > 0) {
          const usersWithChatInfo = await Promise.all(
            results.map(async (user) => {
              const chatQuery = query(
                collection(db, 'CHATS'),
                where('participants', 'array-contains', currentUserId)
              )
              const chatSnapshot = await getDocs(chatQuery)
              let existingChat = null
              chatSnapshot.forEach(doc => {
                const chatData = doc.data()
                if (chatData.participants.includes(user.id)) {
                  existingChat = {
                    id: doc.id,
                    ...chatData
                  }
                }
              })
              return {
                ...user,
                existingChat: existingChat
              }
            })
          )
          setUsers(usersWithChatInfo)
          setUserfound(true)
        } else {
          setUserfound(false)
          setUsers([])
        }
      } else {
        setUserfound(false)
        setUsers([])
      }
    } catch (error) {
      console.error(error)
      setUserfound(false)
      setUsers([])
    }
  }

  return (
    <div className='Searchuser-container'>
      <div className='search-area'>
        <input
          type="text"
          className='search-box'
          placeholder='search user'
          onInput={handleinput}
        />
        {!searching && <img src={search} alt="🔍" className='search-box-icon' />}
        <img
          src={CLOSE_WHITE}
          alt="❌"
          className='close-search'
          onClick={() => navigate('/home')}
        />
      </div>
      {searching && users.length > 0 && userfound ? (
        users.map(user => (
          <ChatItem
            key={user.id}
            user={user}
            existingChat={user.existingChat}
          />
        ))
      ) : !searching && (
        <div className='search-user-result'>
          <EmptyRecentChats />
        </div>
      )}
      {searching && !userfound && (
        <div className='no-user-found'>
          no user found
        </div>
      )}
    </div>
  )
}