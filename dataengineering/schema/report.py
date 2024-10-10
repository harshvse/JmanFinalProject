import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Directory paths
TRANSFORMED_DIR = "./data/prep/"
PLOTS_DIR = "./data/plots/"

# Ensure the plots directory exists
os.makedirs(PLOTS_DIR, exist_ok=True)


def load_transformed_data():
    """Load the transformed data CSV files into DataFrames."""
    users_df = pd.read_csv(os.path.join(TRANSFORMED_DIR, "users_cleaned.csv"))
    courses_df = pd.read_csv(os.path.join(
        TRANSFORMED_DIR, "courses_cleaned.csv"))
    course_user_enriched_df = pd.read_csv(os.path.join(
        TRANSFORMED_DIR, "course_user_enriched.csv"))
    quiz_results_enriched_df = pd.read_csv(os.path.join(
        TRANSFORMED_DIR, "quiz_results_enriched.csv"))
    engagement_df = pd.read_csv(os.path.join(
        TRANSFORMED_DIR, "engagement_cleaned.csv"))
    feedback_df = pd.read_csv(os.path.join(
        TRANSFORMED_DIR, "feedback_cleaned.csv"))

    return users_df, courses_df, course_user_enriched_df, quiz_results_enriched_df, engagement_df, feedback_df


def generate_reports(users_df, courses_df, course_user_enriched_df, quiz_results_enriched_df, engagement_df, feedback_df):
    # 1. User Engagement Over Time
    engagement_df['date'] = pd.to_datetime(
        engagement_df['lastAccessed']).dt.date
    engagement_over_time = engagement_df.groupby('date').agg({
        'totalTimeSpent': 'sum',
        'completed': 'mean'
    }).reset_index()

    plt.figure(figsize=(12, 6))
    sns.lineplot(data=engagement_over_time, x='date',
                 y='totalTimeSpent', label='Total Time Spent')
    sns.lineplot(data=engagement_over_time, x='date',
                 y='completed', label='Engagement Rate')
    plt.title('User Engagement Over Time')
    plt.xticks(rotation=45)
    plt.savefig(os.path.join(PLOTS_DIR, "engagement_over_time.png"))
    plt.clf()

    # 2. Quiz Performance by Course
    quiz_performance = quiz_results_enriched_df.groupby(
        'courseId')['score'].mean().reset_index()
    quiz_performance = quiz_performance.merge(
        courses_df[['id', 'title']], left_on='courseId', right_on='id')

    plt.figure(figsize=(12, 6))
    sns.barplot(data=quiz_performance, x='title', y='score')
    plt.title('Average Quiz Score by Course')
    plt.xticks(rotation=45)
    plt.savefig(os.path.join(PLOTS_DIR, "avg_quiz_score_by_course.png"))
    plt.clf()

    # 3. Course Popularity
    course_popularity = course_user_enriched_df.groupby(
        'courseId')['userId'].nunique().reset_index()
    course_popularity = course_popularity.merge(
        courses_df[['id', 'title']], left_on='courseId', right_on='id')

    plt.figure(figsize=(12, 6))
    sns.barplot(data=course_popularity, x='title', y='userId')
    plt.title('Course Popularity (Number of Enrollments)')
    plt.xticks(rotation=45)
    plt.savefig(os.path.join(PLOTS_DIR, "course_popularity.png"))
    plt.clf()

    # 4. Feedback Distribution
    plt.figure(figsize=(12, 6))
    sns.histplot(feedback_df['rating'], bins=10, kde=True)
    plt.title('Feedback Ratings Distribution')
    plt.xlabel('Rating')
    plt.ylabel('Frequency')
    plt.savefig(os.path.join(PLOTS_DIR, "feedback_distribution.png"))
    plt.clf()

    # 5. User Activity Heatmap
    engagement_df['hour'] = pd.to_datetime(
        engagement_df['lastAccessed']).dt.hour
    engagement_df['day'] = pd.to_datetime(
        engagement_df['lastAccessed']).dt.day_name()

    heatmap_data = engagement_df.pivot_table(
        values='totalTimeSpent', index='day', columns='hour', aggfunc='sum', fill_value=0)

    plt.figure(figsize=(12, 6))
    sns.heatmap(heatmap_data, cmap='YlGnBu', annot=True, fmt='.1f')
    plt.title('User Activity Heatmap by Hour and Day')
    plt.ylabel('Day of Week')
    plt.xlabel('Hour of Day')
    plt.savefig(os.path.join(PLOTS_DIR, "user_activity_heatmap.png"))
    plt.clf()

    # 6. Correlation Matrix
    correlation_data = quiz_results_enriched_df[[
        'score', 'courseId', 'userId']].corr()
    plt.figure(figsize=(10, 8))
    sns.heatmap(correlation_data, annot=True, fmt=".2f", cmap='coolwarm')
    plt.title('Correlation Matrix')
    plt.savefig(os.path.join(PLOTS_DIR, "correlation_matrix.png"))
    plt.clf()

    print("Reports generated successfully!")


def main():
    # Load transformed data
    users_df, courses_df, course_user_enriched_df, quiz_results_enriched_df, engagement_df, feedback_df = load_transformed_data()

    # Generate reports and visualizations
    generate_reports(users_df, courses_df, course_user_enriched_df,
                     quiz_results_enriched_df, engagement_df, feedback_df)


if __name__ == "__main__":
    main()
