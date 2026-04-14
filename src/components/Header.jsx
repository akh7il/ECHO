import React from 'react'
import { useNavigate } from 'react-router-dom'
import ECHO_LOGo from '../../src/assets/icons/ECHO.png'
import BINOCULAR_WHITE from '../../src/assets/icons/binoculars-white.png'
import MENU from '../../src/assets/icons/menu-white.png'
import '../styles/Header.css'

export default function Header() {
  const navigate = useNavigate()
  return (
    <div className='Header-container'>
      <div className='Header-container-left'>
        <img src={ECHO_LOGo} alt="ECHO" className='ECHO-LOGO' />
        <p className='Header-container-left-name'>echo</p>
      </div>
      <div className='Header-container-right'>
        <img src={BINOCULAR_WHITE} alt="SEARCH-USER" className='search-user Header-container-right-icon' onClick={() => navigate('searchuser')} />
        <img src={MENU} alt="MENU" className='menu Header-container-right-icon' onClick={() => navigate('profile')} />
      </div>
    </div>
  )
}
