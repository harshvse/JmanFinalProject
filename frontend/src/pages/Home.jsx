import SideBar from "../components/SideBar";
import styles from "./styles/Home.module.css";
import { Outlet, Route, Routes } from "react-router-dom";
import CourseTiles from "../components/CourseTiles";

const Home = () => {
  const homeLinks = [
    { to: "/course", label: "View All Courses" },
    { to: "/quiz", label: "Quizzes" },
    { to: "/discussion", label: "Discussions" },
  ];

  return (
    <div className={styles.homeContainer}>
      <SideBar links={homeLinks} />
      <Routes>
        <Route path="" element={<div>plain Home</div>} />
        <Route
          path="course"
          element={<CourseTiles buttonLabel="Open Course" />}
        />
        <Route path="quiz" element={<CourseTiles buttonLabel="Open Quiz" />} />
        <Route
          path="discussion"
          element={<CourseTiles buttonLabel="Open Discussion" />}
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Home;
