import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isPrivileged =
    user &&
    (user.isAdmin ||
      user.isShopkeeper ||
      user.role === "shopkeeper" ||
      user.role === "admin");

  // ✅ Allow access if user is admin or shopkeeper; otherwise redirect to /admin/login
  return isPrivileged ? (
    children
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location }} />
  );
};

export default AdminRoute;
