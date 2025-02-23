# Spiderchip - VT Capstone Project

To run frontend:
1. Enter frontend directory (front-end/spiderchip)
2. npm install
3. npm run dev

To run backend (development server):
1. Run `docker compose up --build` inside the main dir (spiderchip)
2. To run in detach mode run `docker compose up --build -d`
3. To stop docker compose run `docker compose down`

To run backend (development server) without Docker:
1. Run PostgreSQL locally and ensure it is up and running.
2. Update the `.env` file with the correct database credentials.
3. Run `npm start` or `npm run dev` inside the backend directory (spiderchip/backend).