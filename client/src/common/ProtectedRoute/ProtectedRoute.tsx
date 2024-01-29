import { Navigate, Outlet } from "react-router-dom";
import Layout from "../Layout";
import { isAuthenticated } from "../../api/auth-api";

const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
