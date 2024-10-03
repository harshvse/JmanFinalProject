import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/CourseView.module.css";
import { useParams } from "react-router-dom";
import { fetchWrapper } from "../helpers";

const CourseView = () => {
  const { courseId } = useParams();
  const [courseContents, setCourseContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchCourseContents();
    setStartTime(Date.now());
    return () => {
      updateTotalTimeSpent();
    };
  }, [courseId]);

  const fetchCourseContents = async () => {
    try {
      const response = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/v1/api/course/${courseId}/contents`
      );
      // Map through course contents and check engagement completion for each
      const updatedContents = await Promise.all(
        response.map(async (content) => {
          // Check engagement completion
          const engagementResponse = await fetchWrapper.get(
            `${
              import.meta.env.VITE_API_URL
            }/v1/api/course/contents/complete?contentId=${content.id}`
          );

          // Return updated content with completion status
          return {
            ...content,
            completed: engagementResponse.completed, // Use the response from the engagement check
          };
        })
      );

      setCourseContents(updatedContents);
    } catch (error) {
      console.error("Error fetching course contents:", error);
    }
  };

  const updateTotalTimeSpent = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setTotalTimeSpent((prev) => prev + timeSpent);
    try {
      await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/course/updatedTime`,
        { contentId: 1, timeSpent }
      );
    } catch (error) {
      console.error("Error updating total time spent:", error);
    }
  };

  const handleContentSelect = (content) => {
    updateTotalTimeSpent();
    setSelectedContent(content);
    setStartTime(Date.now());
  };

  const handleMarkAsComplete = async (contentId) => {
    try {
      await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/course/contents/complete`,
        { contentId: contentId }
      );
      setCourseContents((prevContents) =>
        prevContents.map((content) =>
          content.id === contentId ? { ...content, completed: true } : content
        )
      );
    } catch (error) {
      console.error("Error marking content as complete:", error);
    }
  };

  const formatTimeSpent = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600); // 3600 seconds in an hour
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const formattedHours =
      hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    const formattedMinutes =
      minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";

    return `${formattedHours} ${formattedMinutes}`.trim();
  };

  const calculateProgress = () => {
    const completedContents = courseContents.filter(
      (content) => content.completed
    ).length;
    return (completedContents / courseContents.length) * 100;
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Course Contents</h2>
        <ul className={styles.contentList}>
          {courseContents.map((content) => (
            <li key={content.id} className={styles.contentItem}>
              <span
                className={`${styles.contentTitle} ${
                  selectedContent?.id === content.id ? styles.selected : ""
                }`}
                onClick={() => handleContentSelect(content)}
              >
                {content.title}
              </span>
              <input
                type="checkbox"
                checked={content.completed}
                onChange={() => handleMarkAsComplete(content.id)}
              />
            </li>
          ))}
        </ul>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p>Total Progress: {calculateProgress().toFixed(2)}%</p>
        {/* <p>Total Time Spent: {formatTimeSpent(totalTimeSpent)} seconds</p> */}
      </div>
      <div className={styles.content}>
        {selectedContent ? (
          <>
            <h2>{selectedContent.title}</h2>
            <div className={styles.markContent}>
              <div>{selectedContent.content}</div>
            </div>
          </>
        ) : (
          <p>Select a content item to view</p>
        )}
      </div>
    </div>
  );
};

export default CourseView;
