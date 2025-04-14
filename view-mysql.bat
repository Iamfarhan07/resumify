@echo off
echo Connecting to MySQL...
echo.
echo Use these commands in MySQL:
echo 1. USE resume_builder;
echo 2. SELECT * FROM users;
echo 3. SELECT * FROM resumes;
echo 4. SELECT * FROM ats_analysis;
echo.
echo To exit MySQL, type: exit
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent 