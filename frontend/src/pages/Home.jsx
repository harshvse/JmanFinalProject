import SideBar from "../components/SideBar";
import styles from "./styles/Home.module.css";
import { Outlet, Route, Routes, useParams } from "react-router-dom";
import CourseTiles from "../components/CourseTiles";
import CourseView from "../components/CourseView";

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
          element={
            <CourseTiles buttonLabel="Open Course" buttonLink="course" />
          }
        />
        <Route
          path="quiz"
          element={<CourseTiles buttonLabel="Open Quiz" buttonLink="quiz" />}
        />
        <Route
          path="discussion"
          element={
            <CourseTiles
              buttonLabel="Open Discussion"
              buttonLink="discussion"
            />
          }
        />
        <Route path="course/:courseId" element={<CourseView />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Home;
