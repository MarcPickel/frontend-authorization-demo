import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, anonymous = false }) {
  const { isLoggedIn } = useContext(AppContext);

  const location = useLocation();
  const from = location.state?.from || "/";

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}
