@echo off
npm install > nul
npx prisma migrate dev --name init > nul
npx prisma generate > nul
@echo on
echo Packages installed and database migrated
