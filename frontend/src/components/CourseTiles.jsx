import React, { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "./styles/CourseTiles.module.css";
import { fetchWrapper } from "../helpers";

const CourseTiles = ({ buttonLabel }) => {
  const [coursesData, setCoursesData] = useState("");
  const [page, setPage] = useState(coursesData.currentPage || 1);

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, coursesData.totalPages));
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      const courseData = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/course/user/all?page=${page}&pageSize=5`
      );
      setCoursesData(courseData);
    };
    fetchCourseData();
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={styles.courseGrid}>
        {coursesData &&
          coursesData.courses.map((course) => (
            <div key={course.id} className={styles.courseTile}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseCategory}>{course.category}</p>
              <p className={styles.courseDescription}>
                {course.description.length > 100
                  ? course.description.substr(0, 100)
                  : course.description}
              </p>
              <p className={styles.courseDate}>
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </p>
              <button className={styles.courseButton}>{buttonLabel}</button>
            </div>
          ))}
      </div>
      {coursesData && (
        <div className={styles.pagination}>
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={styles.paginationButton}
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {coursesData.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === coursesData.totalPages}
            className={styles.paginationButton}
          >
            Next
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseTiles;
