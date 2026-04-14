import React, { useState } from 'react'
import { db } from '../services/firebase'
import { auth } from '../services/firebase'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { setLoginStatus, clearLoginStatus } from '../features/login/loginSlice'
import { useDispatch } from 'react-redux'
import TermsAndConditions from '../components/TermsAndConditions'
import ECHOLOGO from '../assets/icons/ECHO.png'
import '../styles/Userinfo.css'

export default function UserInfo() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    secondname: "",
    gender: "",
    dob: "",
    emailVerification: false,
    termsAndConditions: false
  })
  const [username, setUsername] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState(null)
  const [showerrors, setShowerrors] = useState({
    firstname: "",
    secondname: "",
    gender: "",
    dob: "",
    emailVerification: "",
    termsAndConditions: ""
  })
  const [terms, setTerms] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const letterRegex = /^[A-Za-z]+$/
  const setData = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value.toLowerCase()
    });

    if (name === "username") {
      checkUsername(value)
    }
    if (name !== "username") {
      checkField(name, value, checked)
    }
  };
  const checkUsername = async (username) => {
    const cleanedUsername = username.trim().toLowerCase()
    if (!cleanedUsername) {
      setUsernameStatus(null)
      setCheckingUsername(false)
      setUsername(false)
      return
    }
    if (cleanedUsername.length < 4) {
      setUsernameStatus("minimum 4 charecters required")
      return
    }
    setUsernameStatus("")
    setCheckingUsername(true)
    const usernameRef = doc(db, "USERNAMES", cleanedUsername)
    const snap = await getDoc(usernameRef)
    setCheckingUsername(false)
    if (snap.exists()) {
      setUsernameStatus("this username is already taken")
      setUsername(false)
    }
    else {
      setUsernameStatus("available")
      setUsername(true)
    }
  }
  const checkField = (fieldName, value, checked) => {
    if (fieldName === "firstname") {
      if (!value) {
        setShowerrors(prev => ({
          ...prev,
          firstname: "firstname is required"
        }))
        return
      }
      if (!letterRegex.test(value)) {
        setShowerrors(prev => ({
          ...prev,
          firstname: "only letters allowed"
        }))
        return
      }
      if (value.length < 3) {
        setShowerrors(prev => ({
          ...prev,
          firstname: "minimum 3 charecters required"
        }))
        return
      }
    }
    setShowerrors(prev => ({
      ...prev,
      firstname: ""
    }))
    if (fieldName === "secondname") {
      if (!value) {
        setShowerrors(prev => ({
          ...prev,
          secondname: "secondname is required"
        }))
        return
      }
      if (!letterRegex.test(value)) {
        setShowerrors(prev => ({
          ...prev,
          secondname: "only letters allowed"
        }))
        return
      }
      if (value.length < 1) {
        setShowerrors(prev => ({
          ...prev,
          secondname: "minimum 1 charecters required"
        }))
        return
      }
    }
    setShowerrors(prev => ({
      ...prev,
      secondname: ""
    }))
    if (fieldName === "emailVerification") {
      if (checked) {
        setShowerrors(prev => ({
          ...prev,
          emailVerification: ""
        }))
        return
      }
    }
    if (fieldName === "termsAndConditions") {
      if (checked) {
        setShowerrors(prev => ({
          ...prev,
          termsAndConditions: ""
        }))
        return
      }
    }
  }
  const getUserIdFromUserName = async (username) => {
    const q = query(
      collection(db, "USERS"),
      where("username", "==", username)
    )
    const querySnapShot = await getDocs(q)
    if (querySnapShot.empty) {
      dispatch(setLoginStatus("login failed please try again"))
      navigate('/login')
      return
    }
    dispatch(clearLoginStatus(""))
    const uid = querySnapShot.docs[0].id
    return uid
  }
  const createUser = async (e) => {
    e.preventDefault()
    const { firstname, secondname, gender, dob, emailVerification, termsAndConditions } = formData
    if (!username) {
      setUsernameStatus("enter a valid username")
      return
    }
    if (!firstname) {
      setShowerrors(prev => ({
        ...prev,
        firstname: "firstname is required"
      }))
      return
    }
    if (!letterRegex.test(firstname)) {
      setShowerrors(prev => ({
        ...prev,
        firstname: "only letters allowed"
      }))
      return
    }
    if (firstname.length < 3) {
      setShowerrors(prev => ({
        ...prev,
        firstname: "minimum 3 charecters required"
      }))
      return
    }
    setShowerrors(prev => ({
      ...prev,
      firstname: ""
    }))
    if (!secondname) {
      setShowerrors(prev => ({
        ...prev,
        secondname: "secondname is required"
      }))
      return
    }
    if (!letterRegex.test(secondname)) {
      setShowerrors(prev => ({
        ...prev,
        secondname: "only letters allowed"
      }))
      return
    }
    if (secondname.length < 1) {
      setShowerrors(prev => ({
        ...prev,
        secondname: "minimum 1 charecters required"
      }))
      return
    }
    setShowerrors(prev => ({
      ...prev,
      secondname: ""
    }))
    if (!gender) {
      setShowerrors(prev => ({
        ...prev,
        gender: "gender is required"
      }))
      return
    }
    setShowerrors(prev => ({
      ...prev,
      gender: ""
    }))
    let age = null
    const calculateAge = (dob) => {
      const currentDate = new Date()
      const userBOD = new Date(dob)
      age = currentDate.getFullYear() - userBOD.getFullYear()
      let monthDifference = currentDate.getMonth() - userBOD.getMonth()
      if (monthDifference < 0 || monthDifference === 0 && currentDate.getDate() < userBOD.getDate()) {
        age--
      }
      return age
    }
    if (!dob) {
      setShowerrors(prev => ({
        ...prev,
        dob: "dob is required"
      }))
      return
    }
    if (dob) {
      calculateAge(dob)
      if (age < 13) {
        setShowerrors(prev => ({
          ...prev,
          dob: "you must be at least 13 years old"
        }))
        return
      }
      else {
        setShowerrors(prev => ({
          ...prev,
          dob: ""
        }))
      }
    }
    if (!emailVerification) {
      setShowerrors(prev => ({
        ...prev,
        emailVerification: "please verify your email to continue"
      }))
      return
    }
    setShowerrors(prev => ({
      ...prev,
      emailVerification: ""
    }))
    if (!termsAndConditions) {
      setShowerrors(prev => ({
        ...prev,
        termsAndConditions: "you must agree to the terms and conditions to continue"
      }))
      return
    }
    setShowerrors(prev => ({
      ...prev,
      termsAndConditions: ""
    }))
    const user_email = sessionStorage.getItem("email")
    if (!user_email) {
      navigate("/login")
      return
    }
    const currentUser = auth.currentUser
    const currentUserUid = auth.currentUser.uid
    await currentUser.reload()
    if (!currentUser.emailVerified) {
      setShowerrors(prev => ({
        ...prev,
        emailVerification: "please verify your email before logging in"
      }))
      return
    }
    setShowerrors(prev => ({
      ...prev,
      emailVerification: ""
    }))
    await setDoc(doc(db, "USERS", currentUserUid), {
      username: formData.username,
      firstname: formData.firstname,
      secondname: formData.secondname,
      email: user_email,
      gender: formData.gender,
      dob: formData.dob,
      createdAt: new Date()
    })
    const uid = await getUserIdFromUserName(formData.username)
    if (!uid) {
      return
    }
    await setDoc(doc(db, "USERNAMES", formData.username.toLowerCase()), {
      uid: uid
    })
    navigate("/home")
  }
  const fromLogin = sessionStorage.getItem("fromLogin")
  useEffect(() => {
    if (!fromLogin) {
      navigate("/login", { replace: true })
    }
  }, [navigate, fromLogin])
  if (!fromLogin) return null

  return (
    <div className='userinfo-container'>
      <div className='userinfo-container-logo-section'>
        <img src={ECHOLOGO} alt="ECHO" className='userinfo-echo-logo' />
        <p className='userinfo-echo'>echo</p>
      </div>
      <form className='userinfo-container-input-section' onSubmit={createUser}>
        <input type="text" name='username' placeholder='username' className='userinfo' onChange={setData} value={formData.username} />
        {checkingUsername ? <p className='error'>checking username ....</p> : <p className='error'>{usernameStatus}</p>}
        <input type="text" name='firstname' placeholder='first name' className='userinfo' onChange={setData} value={formData.firstname} />
        {showerrors.firstname && <p className='error'>{showerrors.firstname}</p>}
        <input type="text" name='secondname' placeholder='second name' className='userinfo' onChange={setData} value={formData.secondname} />
        {showerrors.secondname && <p className='error'>{showerrors.secondname}</p>}
        <select name='gender' className="userinfo select-gender" onChange={setData} value={formData.gender} >
          <option value="" disabled hidden>gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
        {showerrors.gender && <p className='error'>{showerrors.gender}</p>}
        <input name='dob' type="date" className='userinfo dob' onChange={setData} value={formData.dob} />
        {showerrors.dob && <p className='error'>{showerrors.dob}</p>}
        <label className="agree">email verification completed<input type="checkbox" name='emailVerification' checked={formData.emailVerification} onChange={setData} /></label>
        {showerrors.emailVerification && <p className='error'>{showerrors.emailVerification}</p>}
        <label className="agree terms" onClick={() => setTerms(true)}> <span>agree terms and conditions</span><input type="checkbox" name='termsAndConditions' checked={formData.termsAndConditions} onChange={setData} /></label>
        {showerrors.termsAndConditions && <p className='error'>{showerrors.termsAndConditions}</p>}
        <div className={`TermsAndCondition ${terms ? "show" : ""}`}><TermsAndConditions close={() => setTerms(false)} /></div>
        <button className='userinfo-submit' type='submit'>submit</button>
      </form>
    </div>
  )
}