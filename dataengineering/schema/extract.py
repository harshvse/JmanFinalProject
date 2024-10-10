import os
import pandas as pd
import psycopg2

# Output directory for extracted data
RAW_DATA_DIR = "./data/raw/"

# Ensure the directory exists
os.makedirs(RAW_DATA_DIR, exist_ok=True)

# Database connection parameters
DB_PARAMS = {
    "dbname":  "jidemy",
    "user": "postgres",
    "password": "postgres",
    "host":  "localhost",
    "port": "5432",
}

# Schema name
SCHEMA_NAME = "app"

# Queries to fetch data based on the actual database structure
QUERIES = {
    "users": f"SELECT * FROM {SCHEMA_NAME}.users;",
    "teams": f"SELECT * FROM {SCHEMA_NAME}.teams;",
    "departments": f"SELECT * FROM {SCHEMA_NAME}.departments;",
    "courses": f"SELECT * FROM {SCHEMA_NAME}.courses;",
    "course_content": f"SELECT * FROM {SCHEMA_NAME}.course_content;",
    "course_user": f"SELECT * FROM {SCHEMA_NAME}.\"CourseUser\";",
    "quizzes": f"SELECT * FROM {SCHEMA_NAME}.\"Quiz\";",
    "quiz_questions": f"SELECT * FROM {SCHEMA_NAME}.\"QuizQuestion\";",
    "quiz_options": f"SELECT * FROM {SCHEMA_NAME}.\"QuizOption\";",
    "quiz_results": f"SELECT * FROM {SCHEMA_NAME}.\"QuizResult\";",
    "discussions": f"SELECT * FROM {SCHEMA_NAME}.discussions;",
    "discussion_questions": f"SELECT * FROM {SCHEMA_NAME}.discussion_questions;",
    "discussion_answers": f"SELECT * FROM {SCHEMA_NAME}.discussion_answers;",
    "engagement": f"SELECT * FROM {SCHEMA_NAME}.engagement;",
    "feedback": f"SELECT * FROM {SCHEMA_NAME}.feedback;",
    "roles": f"SELECT * FROM {SCHEMA_NAME}.\"Role\";",
    "user_roles": f"SELECT * FROM {SCHEMA_NAME}.\"UserRoles\";",
}


def extract_data():
    # Connect to the PostgreSQL database
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Fetch and save data for each table
        for table, query in QUERIES.items():
            cursor.execute(query)
            data = cursor.fetchall()

            # Get column names from cursor description
            col_names = [desc[0] for desc in cursor.description]
            df = pd.DataFrame(data, columns=col_names)

            # Save dataframe to CSV
            csv_path = os.path.join(RAW_DATA_DIR, f"{table}.csv")
            df.to_csv(csv_path, index=False)
            print(f"Extracted data for {table}")

        print("Data extraction complete!")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()


if __name__ == "__main__":
    extract_data()
