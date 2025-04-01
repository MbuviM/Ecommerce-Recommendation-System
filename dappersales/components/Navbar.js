import React from 'react'
import styles from '../styles/Navbar.module.css'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

const Navbar = ({user}) => {
  const { logout } = useAuth()
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }
  
  return (
    <div className={styles.col}>
        <div className={styles.first}>
           <div className={styles.name}>Welcome to Dapper Wear!</div> 
        </div>
        <div className={styles.second}>
            <ul>
                <li><Link href='/'>Home</Link></li>
                <li><Link href='/analysis'>Analysis</Link> </li>
                <li><Link href='/market'> MarketPlace</Link></li>
                {
                  user 
                  ?
                  <>
                    <li><Link href='/upload'>Upload Product </Link></li>
                    <li><button className={styles.outbtn} onClick={handleLogout}>Signout</button></li>
                    <li>{user.displayName}</li>
                  </>
                  
                  : null
                }
            </ul>
        </div>
    </div>
  )
}

export default Navbar
