import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Register.module.css'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

const register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const validateForm = () => {
        // Check if all fields are filled
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields")
            return false
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address")
            return false
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return false
        }

        // Check password strength (at least 6 characters)
        if (password.length < 6) {
            setError("Password must be at least 6 characters long")
            return false
        }

        return true
    }

    const { register: authRegister } = useAuth()

    const handleSubmit = async (e) => {
        e && e.preventDefault()
        
        if (!validateForm()) return
        
        setError("")
        setLoading(true)

        try {
            await authRegister(name, email, password)
            // Wait for user data to load before redirecting
            setTimeout(() => {
                router.push("/")
            }, 1000)
        } catch (error) {
            setError(error.message.replace('Firebase: ', ''))
            setLoading(false)
        }
    }

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Create an Account</h1>
            
            {error && <div className={styles.errorAlert}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.inputGroup}>
                    <input 
                        className={styles.main1} 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        placeholder='Enter your name' 
                        required 
                    />
                    <input 
                        className={styles.main1} 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder='Enter your email' 
                        required 
                    />
                    <input 
                        className={styles.main1} 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder='Create password' 
                        required 
                    />
                    <input 
                        className={styles.main1} 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder='Confirm password' 
                        required 
                    />
                    <button 
                        className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <><div className={styles.spinner}></div> Creating Account...</>
                        ) : 'Sign Up'}
                    </button>
                </div>
            </form>
            
            <div className={styles.linkContainer}>
                Already have an account? <Link href="/login">Log In</Link>
            </div>
        </div>
    )
}

export default register
