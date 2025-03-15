import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { me } = useSelector((state) => state.users);

  return me?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
