import React, { useState } from 'react'
import styles from '../styles/Login.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

const login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login: authLogin } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authLogin(email, password);
            // Add delay to ensure auth state updates
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
            setLoading(false);
        }
    };
  return (
    <div className={styles.main}>
      <h1>Login to Dapper Wear</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.inputGroup}>
            <input 
                className={styles.main1}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <input
                className={styles.main1}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
            />
            <button
                className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
                type="submit"
                disabled={loading}
            >
                {loading ? (
                    <><div className={styles.spinner}></div> Logging In...</>
                ) : 'Login'}
            </button>
        </div>
      </form>
      
      <div className={styles.linkContainer}>
        Don't have an account? <Link href="/register">Sign Up</Link>
      </div>
    </div>
  )
}

export default login
