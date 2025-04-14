@echo off
echo ============================================
echo User Management Options
echo ============================================
echo.
echo 1. Delete a user (and all their data)
echo 2. Update user email
echo 3. Update user password
echo 4. View all users
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    set /p userid="Enter user ID to delete: "
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "DELETE FROM users WHERE id=%userid%;"
    echo User deleted successfully.
    pause
)

if "%choice%"=="2" (
    set /p userid="Enter user ID: "
    set /p newemail="Enter new email: "
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "UPDATE users SET email='%newemail%' WHERE id=%userid%;"
    echo Email updated successfully.
    pause
)

if "%choice%"=="3" (
    set /p userid="Enter user ID: "
    set /p newpass="Enter new password: "
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "UPDATE users SET password='%newpass%' WHERE id=%userid%;"
    echo Password updated successfully.
    pause
)

if "%choice%"=="4" (
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pstudent resume_builder -e "SELECT id, username, email, created_at FROM users;"
    pause
)

if "%choice%"=="5" (
    exit
) 