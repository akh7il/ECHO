import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import USER from '../assets/icons/user.png'
import CLOSE_WHITE from '../assets/icons/close-white.png'
import '../styles/Profile.css'

export default function Profile() {
  const [user, setUser] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, 'USERS', currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUser(docSnap.data())
        } else {
          navigate('/')
        }
      } else {
        navigate('/')
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/')
  }
  const full_name =
    user?.firstname && user?.secondname
      ? user.firstname + " " + user.secondname
      : " "
  const username = user?.username ? user.username : "loading..."
  const user_profile =
    user?.firstname?.[0]?.toUpperCase() +
    user?.secondname?.[0]?.toUpperCase()

  return (
    <div className='profile-container'>
      <h1 className='profile-container-head'>
        profile
        <img
          src={CLOSE_WHITE}
          alt="close"
          className='profile-close'
          onClick={() => navigate('/home')}
        />
      </h1>
      <div className='profile-container-body'>
        <div className='user-info'>
          <div className='username'>{user_profile ? user_profile : <img src={USER} />}</div>
          <p className='user-info-name'>{full_name}</p>
          <p className='user-info-username'>{username}</p>
        </div>
        <div className='profile-btns'>
          <button
            className='edit-profile btns'
            onClick={() => navigate('editprofile')}
          >
            edit profile
          </button>
          <button
            className='signout btns'
            onClick={handleSignOut}
          >
            signout
          </button>
        </div>
      </div>
    </div>
  )
}