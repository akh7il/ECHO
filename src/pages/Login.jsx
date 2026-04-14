import React, { useState } from 'react'
import { auth } from '../../src/services/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ECHOLOGO from '../assets/icons/ECHO.png'
import "../styles/Login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signup, setSignup] = useState(true)
  const [emailerror, setEmailerror] = useState("")
  const [passworderror, setPassworderror] = useState("")
  const [signinerror, setSigninError] = useState("")
  const navigate = useNavigate()
  const loginStatus = useSelector(state => state.loginStatus.loginStatus)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const register = async () => {
    if (!email) {
      setEmailerror("this field is required")
      return
    }
    if (!password) {
      setPassworderror("this field is required")
      return
    }
    setPassworderror("")
    try {
      if (emailRegex.test(email)) {
        setEmailerror("")
        if (passwordRegex.test(password)) {
          setPassworderror("")
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          await sendEmailVerification(userCredential.user)
          sessionStorage.setItem("email", email)
          sessionStorage.setItem("fromLogin", "true")
          navigate("/userinfo")
        }
        else {
          setPassworderror("include uppercase lowercase special charecters and numbers")
          setPassword("")
        }
      }
      else {
        setEmailerror("please enter a valid email")
        setEmail("")
      }
    }
    catch (error) {
      setEmailerror("email is already registered please signup")
      setEmail("")
      setPassword("")
    }
  }
  const signin = async () => {
    if (!email) {
      setEmailerror("this field is required")
      return
    }
    if (!password) {
      setPassworderror("this field is required")
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await userCredential.user.reload()
      if (!userCredential.user.emailVerified) {
        setSigninError("Please verify your email and password before logging in")
        setEmailerror("")
        setPassworderror("")
        setEmail("")
        setPassword("")
        return
      }
      navigate("/home")
    }
    catch {
      setSigninError("Login failed. Please check your email and password")
      setEmail("")
      setPassword("")
    }
  }
  
  return (
    <div className='login-container'>
      <div className='login-page-logo-container'>
        <img src={ECHOLOGO} alt="ECHO" className='login-echo-logo' />
        <p className='login-echo'>echo</p>
      </div>
      <div className='input-container'>
        {loginStatus && <p className='errors'>{loginStatus}</p>}
        <input type="text" className='login-container-inputs' placeholder='enter your email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
        {emailerror && <p className='errors'>{emailerror}</p>}
        <input type="password" className='login-container-inputs' placeholder='enter password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
        {passworderror && <p className='errors'>{passworderror}</p>}
        {signinerror && <p className='errors'>{signinerror}</p>}
        {signup ? <p className='signin'><span onClick={() => { setSignup(!signup), setEmailerror(""), setPassworderror(""), setSigninError(""), setEmail(""), setPassword("") }}>already have an account ?</span></p> : <p className='signin'><span onClick={() => { setSignup(!signup), setEmailerror(""), setPassworderror(""), setSigninError(""), setEmail(""), setPassword("") }}>create an account ?</span></p>}
        {signup ? <button className='login-btn' onClick={register}>register</button> : <button className='login-btn' onClick={signin}>signin</button>}
      </div>
    </div>
  )
}