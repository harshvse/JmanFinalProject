import { useSelector, useDispatch } from "react-redux";
import SideBar from "../../components/SideBar";
import styles from "../styles/AdminHome.module.css";
import { Outlet, Route, Routes } from "react-router-dom";
import ManageTeam from "../../components/AdminComponents/ManageTeam";
import ViewEmployees from "../../components/AdminComponents/ViewEmployees";
import CourseManagement from "../../components/AdminComponents/CourseManagement";
import CourseAssignment from "../../components/AdminComponents/CourseAssignment";
import QuizCreation from "../../components/AdminComponents/QuizCreation";
import AdminDashboard from "../../components/AdminComponents/AdminDashboard";
const AdminHome = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { users } = useSelector((x) => x.users);

  // useEffect(() => {
  //   dispatch(userActions.getAll());
  // }, []);

  const adminLinks = [
    { to: "/admin/view-employees", label: "Manage Employees" },
    { to: "/admin/manage-team", label: "Manage Departments" },
    { to: "/admin/course-management", label: "Manage Courses" },
    { to: "/admin/assign-course", label: "Assign Courses" },
    { to: "/admin/create-quiz", label: "Create Quiz" },
  ];

  return (
    <div className={styles.homeContainer}>
      <SideBar links={adminLinks} />
      <Routes>
        <Route path="" element={<AdminDashboard>plain admin</AdminDashboard>} />
        <Route path="admin/manage-team" element={<ManageTeam />} />
        <Route path="admin/view-employees" element={<ViewEmployees />} />
        <Route path="admin/course-management" element={<CourseManagement />} />
        <Route path="admin/assign-course" element={<CourseAssignment />} />
        <Route path="admin/create-quiz" element={<QuizCreation />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default AdminHome;
