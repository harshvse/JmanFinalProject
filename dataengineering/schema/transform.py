import os
import pandas as pd

# Directory paths
RAW_DATA_DIR = "./data/raw/"
TRANSFORMED_DIR = "./data/prep/"

# Ensure the transformed data directory exists
os.makedirs(TRANSFORMED_DIR, exist_ok=True)


def load_csv(file_name):
    """Helper function to load a CSV file into a DataFrame."""
    file_path = os.path.join(RAW_DATA_DIR, file_name)
    return pd.read_csv(file_path)


def transform_data():
    # Load all the CSVs
    users_df = load_csv("users.csv")
    courses_df = load_csv("courses.csv")
    course_content_df = load_csv("course_content.csv")
    course_user_df = load_csv("course_user.csv")
    quizzes_df = load_csv("quizzes.csv")
    quiz_questions_df = load_csv("quiz_questions.csv")
    quiz_options_df = load_csv("quiz_options.csv")
    quiz_results_df = load_csv("quiz_results.csv")
    discussions_df = load_csv("discussions.csv")
    discussion_questions_df = load_csv("discussion_questions.csv")
    discussion_answers_df = load_csv("discussion_answers.csv")
    engagement_df = load_csv("engagement.csv")
    feedback_df = load_csv("feedback.csv")

    # 1. Handle Missing Values
    users_df["teamId"] = users_df["teamId"].fillna(-1).astype(int)
    users_df["departmentId"] = users_df["departmentId"].fillna(-1).astype(int)
    engagement_df["totalTimeSpent"] = engagement_df["totalTimeSpent"].fillna(0)

    # 2. Convert Data Types
    date_columns = {
        "users": ["createdAt"],
        "courses": ["createdAt"],
        "course_content": ["createdAt"],
        "quizzes": ["createdAt"],
        "quiz_results": ["completedAt"],
        "discussions": ["createdAt"],
        "discussion_questions": ["createdAt"],
        "discussion_answers": ["createdAt"],
        "engagement": ["lastAccessed", "createdAt"],
        "feedback": ["createdAt"],
    }

    for table, cols in date_columns.items():
        df = locals()[f"{table}_df"]
        for col in cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
            else:
                print(f"Column '{col}' not found in {table}_df")

    # 3. Data Cleaning
    for df in [users_df, courses_df, course_content_df, quizzes_df]:
        df.drop_duplicates(inplace=True)

    # 4. Data Enrichment
    course_user_enriched_df = course_user_df.merge(
        users_df, left_on="userId", right_on="id", how="left", suffixes=("", "_user")
    ).merge(
        courses_df, left_on="courseId", right_on="id", how="left", suffixes=("", "_course")
    )

    quiz_results_enriched_df = quiz_results_df.merge(
        users_df, left_on="userId", right_on="id", how="left", suffixes=("", "_user")
    ).merge(
        quizzes_df, left_on="quizId", right_on="id", how="left", suffixes=("", "_quiz")
    )

    # 5. Derived Metrics
    engagement_rate = engagement_df.groupby("courseContentId").agg({
        "completed": "mean",
        "totalTimeSpent": "sum"
    }).reset_index()
    engagement_rate = engagement_rate.rename(
        columns={"completed": "engagement_rate"})

    avg_quiz_score = quiz_results_enriched_df.groupby(
        "userId")["score"].mean().reset_index()
    avg_quiz_score = avg_quiz_score.rename(columns={"score": "avg_quiz_score"})

    # 6. Grouping and Aggregating
    courses_per_user = course_user_df.groupby(
        "userId")["courseId"].nunique().reset_index()
    courses_per_user = courses_per_user.rename(
        columns={"courseId": "course_count"})

    avg_feedback_per_course = feedback_df.groupby(
        "courseId")["rating"].mean().reset_index()
    avg_feedback_per_course = avg_feedback_per_course.rename(
        columns={"rating": "avg_rating"})

    # 7. Optimizing DataFrames
    categorical_columns = {
        "users_df": ["firstName", "lastName", "email"],
        "courses_df": ["title", "category"],
        "course_content_df": ["title"],
        "quizzes_df": ["title"],
    }

    for df_name, cols in categorical_columns.items():
        df = locals()[df_name]
        for col in cols:
            df[col] = df[col].astype("category")

    # 8. Saving Transformed Data
    course_user_enriched_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "course_user_enriched.csv"), index=False)
    quiz_results_enriched_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "quiz_results_enriched.csv"), index=False)
    engagement_rate.to_csv(os.path.join(
        TRANSFORMED_DIR, "engagement_rate.csv"), index=False)
    avg_quiz_score.to_csv(os.path.join(
        TRANSFORMED_DIR, "avg_quiz_score.csv"), index=False)
    courses_per_user.to_csv(os.path.join(
        TRANSFORMED_DIR, "courses_per_user.csv"), index=False)
    avg_feedback_per_course.to_csv(os.path.join(
        TRANSFORMED_DIR, "avg_feedback_per_course.csv"), index=False)

    users_df.to_csv(os.path.join(TRANSFORMED_DIR,
                    "users_cleaned.csv"), index=False)
    courses_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "courses_cleaned.csv"), index=False)
    course_content_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "course_content_cleaned.csv"), index=False)
    quizzes_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "quizzes_cleaned.csv"), index=False)
    discussions_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "discussions_cleaned.csv"), index=False)
    engagement_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "engagement_cleaned.csv"), index=False)
    feedback_df.to_csv(os.path.join(
        TRANSFORMED_DIR, "feedback_cleaned.csv"), index=False)

    print("Data transformation complete!")


if __name__ == "__main__":
    transform_data()
