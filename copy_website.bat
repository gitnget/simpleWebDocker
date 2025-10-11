@echo off
REM Copy all files except .git, .vscode folders and .prettierrc file

set SOURCE=C:\mylink\simpleWeb
set DEST=C:\mylink\simpleWebDocker\website

echo Cleaning destination folder %DEST% ...
REM Remove everything inside DEST
rd /s /q "%DEST%"
mkdir "%DEST%"

echo Copying files from %SOURCE% to %DEST% ...

robocopy "%SOURCE%" "%DEST%" /E /R:0 /W:0 ^
  /XD "%SOURCE%\.git" "%SOURCE%\.vscode" ^
  /XF ".prettierrc" "README.md"

echo.
echo Copy completed successfully.
