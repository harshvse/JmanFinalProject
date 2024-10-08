import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../helpers";
import styles from "./styles/UserDashboard.module.css";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto"; // Needed to automatically register chart components

const UserDashboard = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [coursesCompleted, setCoursesCompleted] = useState(0);
  const [quizzesAttempted, setQuizzesAttempted] = useState(0);
  const [averageQuizScore, setAverageQuizScore] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(0);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const [
        courses,
        timeSpent,
        completedCourses,
        quizzes,
        avgScore,
        feedback,
      ] = await Promise.all([
        fetchWrapper.get(
          `${import.meta.env.VITE_API_URL}/v1/api/user-dashboard/totalCourses`
        ),
        fetchWrapper.get(
          `${import.meta.env.VITE_API_URL}/v1/api/user-dashboard/totalTimeSpent`
        ),
        fetchWrapper.get(
          `${
            import.meta.env.VITE_API_URL
          }/v1/api/user-dashboard/coursesCompleted`
        ),
        fetchWrapper.get(
          `${
            import.meta.env.VITE_API_URL
          }/v1/api/user-dashboard/quizzesAttempted`
        ),
        fetchWrapper.get(
          `${
            import.meta.env.VITE_API_URL
          }/v1/api/user-dashboard/averageQuizScore`
        ),
        fetchWrapper.get(
          `${
            import.meta.env.VITE_API_URL
          }/v1/api/user-dashboard/feedbackSubmitted`
        ),
      ]);

      setTotalCourses(courses.totalCourses);
      setTotalTimeSpent(timeSpent.totalTimeSpent);
      setCoursesCompleted(completedCourses.coursesCompleted);
      setQuizzesAttempted(quizzes.quizzesAttempted);
      setAverageQuizScore(avgScore.averageQuizScore);
      setFeedbackSubmitted(feedback.feedbackSubmitted);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const barData = {
    labels: ["Courses Completed", "Quizzes Attempted"],
    datasets: [
      {
        label: "User Stats",
        data: [coursesCompleted, quizzesAttempted],
        backgroundColor: ["#f4d9d0", "#d9abab"],
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      tooltip: {
        titleColor: "white", // Tooltip title color
        bodyColor: "white", // Tooltip body color
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // X-axis tick color
        },
        title: {
          color: "white", // X-axis title color
        },
      },
      y: {
        ticks: {
          color: "white", // Y-axis tick color
        },
        title: {
          color: "white", // Y-axis title color
        },
      },
    },
  };

  const pieData = {
    labels: ["Average Quiz Score"],
    datasets: [
      {
        label: "Average Quiz Score",
        data: [averageQuizScore, 100 - averageQuizScore],
        backgroundColor: ["#f4d9d0", "#d9abab"],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      tooltip: {
        titleColor: "white", // Tooltip title color
        bodyColor: "white", // Tooltip body color
      },
    },
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>User Dashboard</h2>

      {/* Total Stats */}
      <div className={styles.statsContainer}>
        <div className={styles.card}>
          <h3>Total Courses</h3>
          <p>{totalCourses}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Time Spent (hours)</h3>
          <p>{(totalTimeSpent / 3600).toFixed(2)} hours</p>
        </div>
        <div className={styles.card}>
          <h3>Courses Completed</h3>
          <p>{coursesCompleted}</p>
        </div>
        <div className={styles.card}>
          <h3>Quizzes Attempted</h3>
          <p>{quizzesAttempted}</p>
        </div>
        <div className={styles.card}>
          <h3>Average Quiz Score</h3>
          <p>{averageQuizScore.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Feedback Submitted</h3>
          <p>{feedbackSubmitted}</p>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className={styles.chartContainer}>
        <div className={styles.chartCard}>
          <h3>Course Completion vs Attempted Quizzes</h3>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className={styles.chartCard}>
          <h3>Average Quiz Score</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
