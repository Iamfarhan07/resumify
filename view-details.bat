@echo off
echo ============================================
echo Detailed Database Information
echo ============================================
echo.

echo 1. Users with Full Details:
echo -------------------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT id, username, email, created_at, updated_at FROM users;"
echo.

echo 2. Resumes with Content:
echo ----------------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT r.id, r.user_id, u.username, r.title, r.content, r.created_at FROM resumes r JOIN users u ON r.user_id = u.id;"
echo.

echo 3. ATS Analysis with Details:
echo ---------------------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT a.id, a.resume_id, r.title as resume_title, a.score, a.analysis, a.created_at FROM ats_analysis a JOIN resumes r ON a.resume_id = r.id;"
echo.

echo 4. User Statistics:
echo -----------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT u.username, COUNT(r.id) as resume_count, COUNT(a.id) as analysis_count FROM users u LEFT JOIN resumes r ON u.id = r.user_id LEFT JOIN ats_analysis a ON r.id = a.resume_id GROUP BY u.id, u.username;"
echo.

echo 5. Resume Statistics:
echo ------------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT r.title, u.username, a.score, a.created_at as last_analysis_date FROM resumes r JOIN users u ON r.user_id = u.id LEFT JOIN ats_analysis a ON r.id = a.resume_id ORDER BY a.created_at DESC;"
echo.

pause 