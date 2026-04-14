import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ECHOLOGO from '../assets/icons/ECHO.png'
import '../styles/Splash.css'

export default function Splash() {
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      navigate("/welcomescreen")
    }, 3000)
  }, [])
  return (
    <div className='splash-container'>
      <img src={ECHOLOGO} alt="ECHOLOGO" className='echo-logo' />
      <p className='echo'>echo</p>
    </div>
  )
}