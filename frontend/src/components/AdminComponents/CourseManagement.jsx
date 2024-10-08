import React, { useState, useEffect } from "react";
import styles from "../styles/CourseManagement.module.css";
import { fetchWrapper } from "../../helpers";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
const CourseManagement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [courseId, setCourseId] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [content, setContent] = useState("");
  const [orderInCourse, setOrderInCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, pageSize, searchTerm]);

  const fetchCourses = async () => {
    try {
      const response = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/course/courses?page=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`
      );
      setCourses(response.courses);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/course/create`,
        {
          title,
          description,
          category,
        }
      );
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/course/create-content`,
        {
          courseId,
          title: contentTitle,
          content,
          orderInCourse,
        }
      );
    } catch (error) {
      console.error("Error adding content to course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await fetchWrapper.delete(
        `${import.meta.env.VITE_API_URL}/v1/api/course/remove`,
        {
          courseId,
        }
      );
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.mainCon}>
      <h2>Course Management</h2>

      <div className={styles.container}>
        {/* Create New Course */}
        <form onSubmit={handleCreateCourse} className={styles.form}>
          <h3>Create New Course</h3>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.input}
            required
          />
          <button className={styles.button} type="submit">
            Create Course
          </button>
        </form>

        {/* Add Content to Existing Course */}
        <form onSubmit={handleAddContent} className={styles.form}>
          <h3>Add Content to Course</h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.input}
            />
          </div>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">Select Course</option>
            {filteredCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Content Title"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            required
          />
          <input
            type="number"
            placeholder="Order in Course"
            value={orderInCourse}
            onChange={(e) => setOrderInCourse(e.target.value)}
            className={styles.input}
            required
          />
          <button className={styles.button} type="submit">
            Add Content
          </button>
        </form>

        <div className={styles.courseList}>
          <h3>Existing Courses</h3>
          <TableContainer component={Paper}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow className={styles.row}>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow className={styles.row} key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteCourse(course.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className={styles.pagination}>
            <Button
              variant="contained"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="contained"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
