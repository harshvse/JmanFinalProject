import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store";
import styles from "./styles/Nav.module.css";
import { useEffect, useState } from "react";
import { fetchWrapper } from "../helpers";

const Nav = () => {
  const [user, setUser] = useState("");
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUser) {
      return;
    }
    const fetchUserData = async () => {
      const userData = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/v1/api/users/profile`
      );
      setUser(userData);
    };
    fetchUserData();
  }, []);

  const logout = () => dispatch(authActions.logout());
  if (
    window.location.pathname == "/login" ||
    window.location.pathname == "/register" ||
    window.location.pathname == "/registerAdmin"
  ) {
    return null;
  }

  return (
    <nav className={styles.navContainer}>
      <NavLink to="/" styles={styles.navLink}>
        Jin Training Platform
      </NavLink>
      {!authUser ? (
        <div className={styles.log}>
          <NavLink to="/login" styles={styles.navLink}>
            Login
          </NavLink>
        </div>
      ) : (
        <div className={styles.log}>
          {user && (
            <p
              className={styles.greeting}
            >{`Welcome, ${user.firstName} ${user.lastName}`}</p>
          )}
          <button onClick={logout} className="">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
