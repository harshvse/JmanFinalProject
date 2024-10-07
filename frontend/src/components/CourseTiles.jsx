import React, { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "./styles/CourseTiles.module.css";
import { fetchWrapper, history } from "../helpers";

const CourseTiles = ({ buttonLabel, buttonLink }) => {
  const [coursesData, setCoursesData] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, coursesData.totalPages));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 for new search
    fetchCourseData(); // Fetch new data based on search
  };
  const fetchCourseData = async () => {
    const courseData = await fetchWrapper.get(
      `${
        import.meta.env.VITE_API_URL
      }/v1/api/course/user/all?page=${page}&pageSize=6&search=${search}`
    );
    setCoursesData(courseData);
  };

  useEffect(() => {
    fetchCourseData();
  }, [page, search]);

  const handleButtonClick = (id) => {
    history.navigate(`./${buttonLink}/${id}`);
  };

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {/* Course Grid */}
      <div className={styles.courseGrid}>
        {!coursesData ? (
          <div className={styles.notFound}>No Data Found</div>
        ) : (
          ""
        )}
        {coursesData &&
          coursesData.courses.map((course) => (
            <div key={course.id} className={styles.courseTile}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseCategory}>{course.category}</p>
              <p className={styles.courseDescription}>
                {course.description.length > 100
                  ? course.description.substr(0, 100) + "..."
                  : course.description}
              </p>
              <p className={styles.courseDate}>
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleButtonClick(course.id)}
                className={styles.courseButton}
              >
                {buttonLabel}
              </button>
            </div>
          ))}
      </div>

      {/* Pagination */}
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
