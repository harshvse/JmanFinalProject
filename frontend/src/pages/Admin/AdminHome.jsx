import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "../../components/SideBar";
import styles from "../styles/AdminHome.module.css";
import { Outlet, Route, Routes } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
const AdminHome = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { users } = useSelector((x) => x.users);

  // useEffect(() => {
  //   dispatch(userActions.getAll());
  // }, []);

  return (
    <div className={styles.homeContainer}>
      <SideBar></SideBar>
      <Routes>
        <Route path="" element={<div>plain admin</div>} />
        <Route path="manage-employee" element={<div>Manage Employee</div>} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default AdminHome;
