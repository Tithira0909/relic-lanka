# Relic Lanka Tours - Full Stack Project

This project contains the backend API and Admin Dashboard for the Relic Lanka Tours website, along with integration scripts for the existing static frontend.

## Project Structure

- `server/`: Node.js + Express + Prisma (MySQL) backend.
- `admin/`: React + Vite + Tailwind CSS admin dashboard.
- `js/api-integration.js`: Vanilla JS integration script for the frontend.
- `*.html`: Existing static frontend files.

## Setup Instructions

### 1. Database Setup (MySQL)
Ensure you have a MySQL database running. Create a database named `relic_lanka` (or whatever you prefer).

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` with your configuration:
   ```env
   PORT=3000
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DBNAME"
   JWT_ACCESS_SECRET="your_super_secret_access_key"
   JWT_REFRESH_SECRET="your_super_secret_refresh_key"
   CORS_ORIGIN="*"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database (creates Admin user):
   ```bash
   npm run seed
   ```
   **Default Admin Credentials:**
   - Email: `admin@example.com`
   - Password: `password123`

6. Start the server:
   ```bash
   npm run dev
   ```

### 3. Admin Dashboard Setup
1. Navigate to the `admin` directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

### 4. Frontend Integration
The frontend integration scripts have been applied to the following files:
- `index.html`: Home page gallery and featured tours.
- `destination.html`: Tours list page.
- `tour-detail.html`: Dynamic tour detail page (created).
- `about.html`: Dynamic about us content.
- `contact.html`: Inquiry form integration.

You can modify `js/api-integration.js` to adjust rendering logic.

## Features

- **Public API**: Fetch tours, gallery, pages, settings.
- **Admin API**: Secured with JWT. Manage everything.
- **Tour Management**: Complex nested structure (Itinerary, Destinations, Experiences).
- **Inquiry Management**: View and update status of inquiries.
- **Media Uploads**: Local file storage implemented (easy switch to S3).

## Deployment

1. **Server**: Build with `npm run build` and run `npm start`. Set `NODE_ENV=production`.
2. **Admin**: Build with `npm run build` and serve the `dist` folder.
3. **Database**: Apply migrations using `npx prisma migrate deploy`.
