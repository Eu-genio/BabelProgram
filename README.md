# BabelProgram
Project dedicated to aid Language Teachers with their students and vice versa. Goal is to provide a service where students and teachers have smooth teaching/learning experience. For Teachers, this could aid in tracking of its many students with personal notes, templates, student progress etc... or students keeping track of their studies/homework/progress etc...

Frontend: React SPA (Vite + TypeScript), located in /frontend/babel-ui, calling API via VITE_API_BASE_URL.

Backend: ASP.NET Core Web API (.NET 8), located in /backend/Babel.Api, with CORS enabled for local dev.

Local dev: React runs on localhost:5173, backend on localhost:5240.

Connected via: .env.local in frontend and CORS policy in backend.

Version control: GitHub repo named BabelProgram.

Hosting plan: Frontend will be deployed via AWS Amplify, backend via AWS App Runner or Elastic Beanstalk.

Database (planned): Amazon RDS with EF Core integration.

IDE: Visual Studio 2022 for backend, terminal/VSC for frontend.

Project goal: Teachers can create profiles and teach English or other languages to students.
