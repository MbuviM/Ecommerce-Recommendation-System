import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  return children;
};

export default ProtectedRoute;