import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../../helpers";
import styles from "../styles/QuizCreation.module.css";

const QuizCreation = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: [{ option: "", isCorrect: false }] },
  ]);
  const [courseSearch, setCourseSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);
  const [courseTotalPages, setCourseTotalPages] = useState(1);
  const [quizExists, setQuizExists] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchCourses();
  }, [coursePage, courseSearch]);

  useEffect(() => {
    if (selectedCourse) {
      checkExistingQuiz(selectedCourse);
    }
  }, [selectedCourse]);

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

  const checkExistingQuiz = async (courseId) => {
    try {
      const response = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/v1/api/quiz/check/${courseId}`
      );
      console.log(response.exists);
      setQuizExists(response.exists);
      if (response.exists) {
        alert(
          "A quiz already exists for this course. You cannot create another one."
        );
      }
    } catch (error) {
      console.error("Error checking existing quiz:", error);
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].option = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, index) => {
      option.isCorrect = index === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: [{ option: "", isCorrect: false }] },
    ]);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ option: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !quizTitle || questions.length === 0 || quizExists) {
      alert(
        "Please fill in all fields and ensure a quiz doesn't already exist for this course"
      );
      return;
    }

    try {
      const response = await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/quiz/create`,
        {
          courseId: selectedCourse,
          title: quizTitle,
          questions: questions,
        }
      );
      alert("Quiz created successfully");
      // Reset form
      setSelectedCourse("");
      setQuizTitle("");
      setQuestions([
        { question: "", options: [{ option: "", isCorrect: false }] },
      ]);
      setQuizExists(false);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Quiz</h2>

      <div className={styles.courseSelection}>
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

      {quizExists && (
        <div className={styles.warningMessage}>
          A quiz already exists for this course. You cannot create another one.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.quizForm}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className={styles.input}
          required
          disabled={quizExists}
        />

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className={styles.questionBox}>
            <input
              type="text"
              placeholder={`Question ${questionIndex + 1}`}
              value={question.question}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
              className={styles.input}
              required
              disabled={quizExists}
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className={styles.optionBox}>
                <input
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option.option}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                  className={styles.input}
                  required
                  disabled={quizExists}
                />
                <label className={styles.correctLabel}>
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={option.isCorrect}
                    onChange={() =>
                      handleCorrectOptionChange(questionIndex, optionIndex)
                    }
                    required
                    disabled={quizExists}
                  />
                  Correct
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(questionIndex)}
              className={styles.addButton}
              disabled={quizExists}
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className={styles.addButton}
          disabled={quizExists}
        >
          Add Question
        </button>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={quizExists}
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizCreation;
