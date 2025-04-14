@echo off
echo Viewing all data in database...
echo.
echo Users:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT id, username, email, created_at FROM users;"
echo.
echo Resumes:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT id, user_id, title, created_at FROM resumes;"
echo.
echo ATS Analysis:
 