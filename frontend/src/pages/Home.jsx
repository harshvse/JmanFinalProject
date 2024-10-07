import SideBar from "../components/SideBar";
import styles from "./styles/Home.module.css";
import { Outlet, Route, Routes, useParams } from "react-router-dom";
import CourseTiles from "../components/CourseTiles";
import CourseView from "../components/CourseView";
import Quiz from "../components/Quiz";
import DiscussionPanel from "../components/DiscussionPanel";
import Feedback from "../components/Feedback";
import UserDashboard from "../components/UserDashboard";

const Home = () => {
  const homeLinks = [
    { to: "/course", label: "View All Courses" },
    { to: "/quiz", label: "Quizzes" },
    { to: "/discussion", label: "Discussions" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <div className={styles.homeContainer}>
      <SideBar links={homeLinks} />
      <Routes>
        <Route path="" element={<UserDashboard />} />
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
        <Route
          path="feedback"
          element={
            <CourseTiles buttonLabel="Give Feedback" buttonLink="feedback" />
          }
        />
        <Route path="course/:courseId" element={<CourseView />} />
        <Route path="quiz/:courseId" element={<Quiz />} />
        <Route path="discussion/:courseId" element={<DiscussionPanel />} />
        <Route path="feedback/:courseId" element={<Feedback />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Home;
