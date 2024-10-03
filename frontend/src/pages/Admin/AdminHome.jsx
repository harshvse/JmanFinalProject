import { useSelector, useDispatch } from "react-redux";
import SideBar from "../../components/SideBar";
import styles from "../styles/AdminHome.module.css";
import { Outlet, Route, Routes } from "react-router-dom";
import ManageTeam from "../../components/ManageTeam";
import ViewEmployees from "../../components/ViewEmployees";
const AdminHome = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { users } = useSelector((x) => x.users);

  // useEffect(() => {
  //   dispatch(userActions.getAll());
  // }, []);

  const adminLinks = [
    { to: "/admin/view-employees", label: "View Employees" },
    { to: "/admin/manage-team", label: "Manage Team" },
  ];

  return (
    <div className={styles.homeContainer}>
      <SideBar links={adminLinks} />
      <Routes>
        <Route path="" element={<div>plain admin</div>} />
        <Route path="admin/manage-team" element={<ManageTeam />} />
        <Route path="admin/view-employees" element={<ViewEmployees />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default AdminHome;
