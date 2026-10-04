import { useAuth } from "../hooks/useAuth";
import { FaSpinner } from "react-icons/fa";
import {Navigate}  from 'react-router-dom'
import { ROUTES } from "../utils/constants";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-obsidian-gold mx-auto" />
          <p className="mt-4 text-obsidian-muted">Loading...</p>
        </div>
      </div>
    );
  }


  if(!isAuthenticated){
    return <Navigate to={ROUTES.HOME} replace/>
  }


  return children;
}



export default ProtectedRoute;