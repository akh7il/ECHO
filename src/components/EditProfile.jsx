import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../services/firebase'
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore'
import PEN_BLACK from '../assets/icons/pen-black.png'
import CLOSE_WHITE from '../assets/icons/close-white.png'
import '../styles/Editprofile.css'

export default function EditProfile() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [secondname, setSecondname] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("")
    const [dob, setDob] = useState("")
    const [usernameStatus, setUsernameStatus] = useState("")
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({})
    const [originalFirstname, setOriginalFirstname] = useState("")
    const [originalSecondname, setOriginalSecondname] = useState("")
    const [originalUsername, setOriginalUsername] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser
            if (!currentUser) {
                navigate('/')
                return
            }
            
            const userRef = doc(db, "USERS", currentUser.uid)
            const userSnap = await getDoc(userRef)
            
            if (userSnap.exists()) {
                const data = userSnap.data()
                setUserData(data)
                setUsername(data.username || "")
                setOriginalUsername(data.username || "")
                setFirstname(data.firstname || "")
                setSecondname(data.secondname || "")
                setOriginalFirstname(data.firstname || "")
                setOriginalSecondname(data.secondname || "")
                setEmail(data.email || currentUser.email || "")
                setGender(data.gender || "")
                setDob(data.dob || "")
            }
            setLoading(false)
        }
        
        fetchUserData()
    }, [navigate])

    const calculateAge = (dobString) => {
        const birthDate = new Date(dobString)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!firstname.trim() || firstname.length < 3) {
            newErrors.firstname = "must be at least 3 characters"
            setErrors(newErrors)
            return false
        }
        
        if (!secondname.trim() || secondname.length < 1) {
            newErrors.secondname = "must be at least 1 character"
            setErrors(newErrors)
            return false
        }
        
        if (!gender) {
            newErrors.gender = "Please select a gender"
            setErrors(newErrors)
            return false
        }
        
        if (dob) {
            const age = calculateAge(dob)
            if (age < 13) {
                newErrors.dob = "You must be at least 13 years old"
                setErrors(newErrors)
                return false
            }
        }
        
        setErrors({})
        return true
    }

    const checkUsername = async (e) => {
        const newUsername = e.target.value
        setUsername(newUsername)
        
        if (newUsername === originalUsername) {
            setUsernameStatus("")
            setIsUsernameAvailable(true)
            return
        }
        
        if (newUsername.trim() === "") {
            setUsernameStatus("")
            setIsUsernameAvailable(false)
            return
        }
        
        setCheckingUsername(true)
        const cleanedUsername = newUsername.toLowerCase().trim()
        const usernameRef = doc(db, "USERNAMES", cleanedUsername)
        const snap = await getDoc(usernameRef)
        setCheckingUsername(false)
        
        if (snap.exists()) {
            setUsernameStatus("this username is already taken")
            setIsUsernameAvailable(false)
        } else {
            setUsernameStatus("available")
            setIsUsernameAvailable(true)
        }
    }

    const handleDobChange = (e) => {
        const newDob = e.target.value
        setDob(newDob)
        if (newDob) {
            const age = calculateAge(newDob)
            if (age < 13) {
                setErrors({ dob: "You must be at least 13 years old" })
            } else {
                if (errors.dob) {
                    setErrors({})
                }
            }
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        if (!isUsernameAvailable && username !== originalUsername) {
            alert("Please choose a different username")
            return
        }
        
        const currentUser = auth.currentUser
        if (!currentUser) return
        
        const userRef = doc(db, "USERS", currentUser.uid)
        
        if (username !== originalUsername && originalUsername) {
            const oldUsernameRef = doc(db, "USERNAMES", originalUsername.toLowerCase())
            await deleteDoc(oldUsernameRef)
            
            const newUsernameRef = doc(db, "USERNAMES", username.toLowerCase())
            await setDoc(newUsernameRef, { 
                uid: currentUser.uid
            })
        }
        
        await updateDoc(userRef, {
            username,
            firstname,
            secondname,
            gender,
            dob
        })
        
        setOriginalFirstname(firstname)
        setOriginalSecondname(secondname)
        setOriginalUsername(username)
        setIsEditing(false)
        
        navigate('/home/profile')
    }

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setUsername(originalUsername)
        setFirstname(originalFirstname)
        setSecondname(originalSecondname)
        setGender(userData?.gender || "")
        setDob(userData?.dob || "")
        setErrors({})
        setUsernameStatus("")
        setIsEditing(false)
    }

    const user_profile = originalFirstname?.[0]?.toUpperCase() + originalSecondname?.[0]?.toUpperCase()

    if (loading) return <div className='editprofile-container'>Loading...</div>

    const inputStyle = !isEditing ? { cursor: "not-allowed" } : {}
    const selectStyle = !isEditing ? { cursor: "not-allowed" } : {}

    return (
        <div className='editprofile-container'>
            <h1 className='editprofile-container-head'>
                edit profile
                <img src={CLOSE_WHITE} alt="close" className='close-profile' onClick={() => navigate('/home/profile')} />
            </h1>
            <div className='editprofile-container-body'>
                <form onSubmit={handleSave} className='editprofile-container-body-form'>
                    <div className='profile' onClick={handleEditClick} style={{ cursor: "pointer" }}>
                        {user_profile || "AK"}
                        <img src={PEN_BLACK} alt="pen" className='edit-icon' />
                    </div>
                    
                    <input 
                        type="text" 
                        className='edit-profile-input' 
                        placeholder='username' 
                        value={username}
                        onChange={checkUsername}
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        style={inputStyle}
                    />
                    {checkingUsername && <small>Checking username...</small>}
                    {usernameStatus && isEditing && (
                        <small style={{ color: usernameStatus === "available" ? "green" : "red" }}>
                            {usernameStatus}
                        </small>
                    )}
                    
                    <input 
                        type="text" 
                        className='edit-profile-input' 
                        placeholder='firstname' 
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        style={inputStyle}
                    />
                    {errors.firstname && isEditing && <small style={{ color: "red" }}>{errors.firstname}</small>}
                    
                    <input 
                        type="text" 
                        className='edit-profile-input' 
                        placeholder='secondname' 
                        value={secondname}
                        onChange={(e) => setSecondname(e.target.value)}
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        style={inputStyle}
                    />
                    {errors.secondname && isEditing && <small style={{ color: "red" }}>{errors.secondname}</small>}
                    
                    <input 
                        type="email" 
                        className='edit-profile-input' 
                        placeholder='email' 
                        value={email}
                        readOnly
                        disabled
                        style={{ cursor: "not-allowed" }}
                    />
                    
                    <select 
                        className='edit-profile-input select' 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={!isEditing}
                        style={selectStyle}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && isEditing && <small style={{ color: "red" }}>{errors.gender}</small>}
                    
                    <input 
                        type="date" 
                        className='edit-profile-input' 
                        placeholder='date of birth' 
                        value={dob}
                        onChange={handleDobChange}
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        style={inputStyle}
                    />
                    {errors.dob && isEditing && <small style={{ color: "red" }}>{errors.dob}</small>}
                    
                    {isEditing ? (
                        <div className='edit-profile-buttons'>
                            <button type="submit" className='save-profile'>save</button>
                            <button type="button" className='save-profile' onClick={handleCancel}>cancel</button>
                        </div>
                    ) : (
                        <button type="button" className='save-profile edit' onClick={handleEditClick}>edit profile</button>
                    )}
                </form>
            </div>
        </div>
    )
}