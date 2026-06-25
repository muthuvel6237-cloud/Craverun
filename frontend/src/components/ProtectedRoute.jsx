import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, type }) {
  const customerToken = localStorage.getItem("token");
  const ownerToken = localStorage.getItem("ownerToken");

  if (type === "owner" && !ownerToken) {
    return <Navigate to="/owner/login" replace />;
  }

  if (type === "customer" && !customerToken) {
    return <Navigate to="/customer/login" replace />;
  }

  return children;
}

export default ProtectedRoute;