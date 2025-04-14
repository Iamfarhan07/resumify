@echo off
echo Viewing users in database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT id, username, email, created_at FROM users;"
pause 