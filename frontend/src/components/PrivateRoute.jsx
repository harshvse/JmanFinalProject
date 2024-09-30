import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, roles }) => {
  const { user: authUser } = useSelector((x) => x.auth);

  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }

  // check if route is restricted by role
  if (roles && roles.length && !roles.includes(authUser.roles[0])) {
    // role not authorized so redirect to home page
    return <Navigate to="/" />;
  }

  // authorized so return child components
  return children;
};

export default PrivateRoute;
