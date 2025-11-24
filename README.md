🏋️ Gym App Backend

This is the backend for my Gym App project. It’s built with Node.js, Express, and MySQL, and it handles members, workouts, and user workout logs. It’s designed so users can track their progress while following workout programs.

⸻

Features
	•	Manage gym members (add, view, update, delete)
	•	Manage workouts (list of exercises, read-only for users)
	•	Track workout logs for each user (sets, reps, weight, date)
	•	Seeded sample data for testing and development
	•	Ready for future expansion with programs and progress tracking

⸻

Tech Stack
	•	Node.js
	•	Express.js
	•	MySQL (Docker)
	•	mysql2 library
	•	CORS enabled
  
Getting Started

1.	Clone the repo: git clone https://github.com/<your-username>/gym-app-be.git
cd gym-app-be

2.	Install dependencies:npm install
   
3.	 Start MySQL in Docker:docker run --name gym-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=gym_app \
  -e MYSQL_USER=gymapp \
  -e MYSQL_PASSWORD=gym123 \
  -p 3306:3306 -d mysql:8.0

4.	Check db.js to make sure the database credentials match your setup.
  	 
5.	Start the backend:npm start

6.	The server will run at http://localhost:3001

   API Endpoints

Members
	•	GET /members → get all members
	•	GET /members/:id → get a specific member
	•	POST /members → add a new member
	•	PUT /members/:id → update a member
	•	DELETE /members/:id → delete a member

Workouts
	•	GET /workouts → get all workouts
	•	GET /workouts/:id → get a specific workout

Workout Logs
	•	GET /workout-logs/:user_id → get all logs for a user
	•	POST /workout-logs → add a new workout log
	•	PATCH /workout-logs/:id → update a workout log
	•	DELETE /workout-logs/:id → delete a workout log

⸻

Database Structure
	•	members: id, name, email, phone, membership, created_at
	•	workouts: id, name, description, sets, reps, weight, day, created_at
	•	workout_logs: id, user_id, workout_id, sets_done, reps_done, weight_done, date, created_at

⸻

Future Improvements
	•	Add programs (weekly workout schedules with multiple workouts per day)
	•	Track user progress over time with charts or stats
	•	Add authentication and user roles (admin, member)
	•	Connect to a frontend interface

⸻

License

MIT License © 2025


  
