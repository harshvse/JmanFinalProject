import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { history } from "./helpers";
import Nav from "./components/Nav";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import AdminHome from "./pages/Admin/AdminHome";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import RegisterAdmin from "./pages/RegisterAdmin";
import Register from "./pages/Register";
import { useSelector } from "react-redux";

const App = () => {
  history.navigate = useNavigate();
  history.location = useLocation();

  const { user: authUser } = useSelector((x) => x.auth);

  return (
    <div>
      <Nav />
      <ToastContainer />
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerAdmin" element={<RegisterAdmin />} />
          <Route
            path="/*"
            element={authUser.roles[0] == "Admin" ? <AdminHome /> : <Home />}
          />
          {/* <Route
            path="/admin/:eventId?"
            element={
              <PrivateRoute roles={["Admin"]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute roles={["Admin"]}>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <PrivateRoute roles={["Admin"]}>
                <UserOrder />
              </PrivateRoute>
            }
          /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
