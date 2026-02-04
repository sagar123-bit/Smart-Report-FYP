import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  isPublicRoute = false 
}) => {
  const user = useSelector(state => state?.user?.user);
  const isLoading = useSelector(state => state?.user?.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
      </div>
    );
  }

  if (isPublicRoute) {
    if (!user) {
      return children;
    }
    
    if (user.userType === "admin") {
      return <Navigate to="/admindashboard" replace />;
    } else if (user.userType === "police") {
      return <Navigate to="/policedashboard" replace />;
    } else if (user.userType === "citizen") {
      return children;
    }
    
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    if (user.userType === "admin") {
      return <Navigate to="/admindashboard" replace />;
    } else if (user.userType === "police") {
      return <Navigate to="/policedashboard" replace />;
    } else if (user.userType === "citizen") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;