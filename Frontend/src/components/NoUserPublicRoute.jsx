import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const NoUserPublicRoute = ({ children }) => {
  const user = useSelector(state => state?.user?.user);
  const isLoading = useSelector(state => state?.user?.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
      </div>
    );
  }

  if (user) {
    if (user.userType === "admin") {
      return <Navigate to="/admindashboard" replace />;
    } else if (user.userType === "police") {
      return <Navigate to="/policedashboard" replace />;
    }
    else{
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default NoUserPublicRoute;