import '../styles/globals.css'
import Navbar from '../components/Navbar.js'
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  )
}

function AppContent({ Component, pageProps }) {
  const { currentUser } = useAuth()
  
  return (
    <>
      <Navbar user={currentUser} />
      <Component {...pageProps} user={currentUser} />
    </>
  )
}

export default MyApp
