# Important: Database Configuration

The application requires a MySQL database to run.

## 1. Create the Database
Ensure you have MySQL installed and running. Create a database named `reliclanka` (or your preferred name).

```sql
CREATE DATABASE reliclanka;
```

## 2. Configure Environment Variables
Edit the `server/.env` file to match your MySQL user, password, and database name.

**Example `server/.env`:**
```env
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@127.0.0.1:3306/reliclanka"

# Admin Auth Secrets (Change these for production)
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Admin Email (Optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user"
SMTP_PASS="pass"
SMTP_FROM="admin@example.com"
```

## 3. Run Migrations & Seed Data
Initialize the database schema and add sample data (admin user, tour).

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run seed
```

## 4. Start the Server
```bash
npm run dev
```

The server runs on http://localhost:3000.
The admin dashboard login is `admin@example.com` / `password123`.
