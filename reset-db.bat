@echo off
echo Resetting database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent < setup.sql
echo Database reset complete.
pause 