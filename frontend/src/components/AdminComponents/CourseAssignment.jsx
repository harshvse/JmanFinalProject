import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../../helpers";
import styles from "../styles/CourseAssignment.module.css";

const CourseAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [courseTotalPages, setCourseTotalPages] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, [coursePage, userPage, courseSearch, userSearch]);

  const fetchCourses = async () => {
    try {
      const response = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/course/courses?page=${coursePage}&pageSize=${pageSize}&search=${courseSearch}`
      );
      setCourses(response.courses);
      setCourseTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/admin/fetchEmployees?page=${userPage}&pageSize=${pageSize}&search=${userSearch}`
      );
      setUsers(response.users);
      setUserTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedCourse || !selectedUser) {
      alert("Please select both a course and a user");
      return;
    }

    try {
      await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/course/assign`,
        {
          courseId: selectedCourse,
          userId: selectedUser,
        }
      );
      alert("Course assigned successfully");
      setSelectedCourse("");
      setSelectedUser("");
    } catch (error) {
      console.error("Error assigning course:", error);
      alert("Failed to assign course");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Assign Course to User</h2>

      <div className={styles.selectionContainer}>
        <div className={styles.selectionBox}>
          <h3>Select Course</h3>
          <input
            type="text"
            placeholder="Search courses..."
            value={courseSearch}
            onChange={(e) => {
              setCourseSearch(e.target.value);
              setCoursePage(1);
            }}
            className={styles.searchInput}
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <div className={styles.pagination}>
            <button
              onClick={() => setCoursePage((prev) => Math.max(prev - 1, 1))}
              disabled={coursePage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span>
              Page {coursePage} of {courseTotalPages}
            </span>
            <button
              onClick={() =>
                setCoursePage((prev) => Math.min(prev + 1, courseTotalPages))
              }
              disabled={coursePage === courseTotalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>

        <div className={styles.selectionBox}>
          <h3>Select User</h3>
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUserPage(1);
            }}
            className={styles.searchInput}
          />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName} ${user.email}`}
              </option>
            ))}
          </select>
          <div className={styles.pagination}>
            <button
              onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
              disabled={userPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span>
              Page {userPage} of {userTotalPages}
            </span>
            <button
              onClick={() =>
                setUserPage((prev) => Math.min(prev + 1, userTotalPages))
              }
              disabled={userPage === userTotalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <button onClick={handleAssign} className={styles.assignButton}>
        Assign Course to User
      </button>
    </div>
  );
};

export default CourseAssignment;
