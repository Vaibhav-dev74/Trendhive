import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // ✅ Allow access only if the user is an admin
  return user && user.isAdmin ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default AdminRoute;
