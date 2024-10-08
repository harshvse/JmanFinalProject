import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { fetchWrapper } from "../../helpers";
import styles from "../styles/AdminDashboard.module.css"; // Create this CSS file for styling

const AdminDashboard = () => {
  const [engagementData, setEngagementData] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [timeSpentData, setTimeSpentData] = useState({});
  const [discussionData, setDiscussionData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseId, setCourseId] = useState(1); // Assuming a default course ID for demonstration

  useEffect(() => {
    // Fetch all required data when the component mounts
    fetchEngagementData();
    fetchQuizScores();
    fetchTimeSpentData();
    fetchDiscussionData();
    fetchCourses(); // Fetch courses data
  }, [courseId]);

  const fetchEngagementData = async () => {
    try {
      const data = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/admin-dashboard/engagement/${courseId}`
      );
      setEngagementData(data);
    } catch (error) {
      console.error("Error fetching engagement data:", error);
    }
  };

  const fetchQuizScores = async () => {
    try {
      const data = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/admin-dashboard/scores/${courseId}`
      );
      setQuizScores(data);
    } catch (error) {
      console.error("Error fetching quiz scores:", error);
    }
  };

  const fetchTimeSpentData = async () => {
    try {
      const data = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/admin-dashboard/timespent/${courseId}`
      );
      setTimeSpentData(data);
    } catch (error) {
      console.error("Error fetching time spent data:", error);
    }
  };

  const fetchDiscussionData = async () => {
    try {
      const data = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/admin-dashboard/discussions/${courseId}`
      );
      setDiscussionData(data);
    } catch (error) {
      console.error("Error fetching discussion data:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/course/courses?page=1&pageSize=10&search=${searchTerm}`
      );
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchCourses(); // Re-fetch courses when search term changes
  };

  // Prepare data for the pie chart
  const engagementChartData = engagementData.map((item) => ({
    name: item.user.name,
    value: item.totalTimeSpent,
  }));

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h5">Engagement Data</Typography>
              <PieChart width={400} height={400}>
                <Pie
                  data={engagementChartData}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {engagementChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#0088FE" : "#00C49F"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h5">Quiz Scores</Typography>
              <ul>
                {quizScores.map((score) => (
                  <li key={score.userId}>
                    {score.user.name}: {score.score} points
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h5">Total Time Spent</Typography>
              <Typography variant="h6">
                {timeSpentData.totalTimeSpent || 0} minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h5">Discussion Data</Typography>
              <ul>
                {discussionData.map((discussion) => (
                  <li key={discussion.id}>
                    {discussion.topic}:{" "}
                    {discussion.comments ? discussion.comments.length : "No "}{" "}
                    comments
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h5">Courses</Typography>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  variant="outlined"
                  placeholder="Search Courses"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ marginBottom: "20px", width: "100%" }}
                />
              </form>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course ID</TableCell>
                      <TableCell>Course Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses &&
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>{course.id}</TableCell>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.description}</TableCell>
                          <TableCell>
                            {/* Add actions like edit, delete, etc. */}
                            <button>Edit</button>
                            <button>Delete</button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
