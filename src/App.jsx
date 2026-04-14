import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from './services/firebase'
import { Routes, Route } from 'react-router-dom'
import WelcomeScreen from './pages/WelcomeScreen'
import Login from './pages/Login'
import UserInfo from './pages/UserInfo'
import Home from './pages/Home'
import EmptyRecentChats from './components/EmptyRecentChats'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import SearchUser from './components/SearchUser'
import RecentChat from './components/RecentChat'
import Splash from './pages/Splash'
import './styles/App.css'

export default function App() {
  const [currentuser, setCurrentUser] = useState(null)
  const [recentChats, setRecentChats] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid)
      } else {
        setCurrentUser(null)
        setRecentChats(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const checkRecentChats = async () => {
      if (!currentuser) return
      const q = query(collection(db, "CHATS"), where("participants", "array-contains", currentuser))
      const querySnapshot = await getDocs(q)
      setRecentChats(!querySnapshot.empty)
    }
    checkRecentChats()
  }, [currentuser])

  return (
    <Routes>
      <Route path='/' element={<Splash />} />
      <Route path='welcomescreen' element={<WelcomeScreen />} />
      <Route path='login' element={<Login />} />
      <Route path='userinfo' element={<UserInfo />} />
      <Route path='home' element={<Home />}>
        <Route index element={recentChats ? <RecentChat /> : <EmptyRecentChats />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/editprofile' element={<EditProfile />} />
        <Route path='searchuser' element={<SearchUser />} />
      </Route>
    </Routes>
  )
}