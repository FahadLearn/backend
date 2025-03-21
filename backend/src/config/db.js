import mysql from "mysql2/promise"; // Use promise-based MySQL2
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// // Create database connection pool
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Check database connection
// async function checkDB() {
//   try {
//     const connection = await db.getConnection(); // Get a single connection from the pool
//     console.log("✅ DB Connected...");
//     connection.release(); // Release connection back to pool
//   } catch (error) {
//     console.error("❌ Database Connection Error:", error);
//     process.exit(1);
//   }
// }

// checkDB(); // Run check function

// export default db;
dotenv.config(); // ✅ Ensure .env file is loaded

// ✅ Create MySQL connection (Using Promise-based MySQL2)
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

// ✅ Check database connection
try {
  await db.connect(); // Ensure connection
  console.log("Connected to MySQL database!");
} catch (err) {
  console.error(" Database Connection Failed:", err.message);
  process.exit(1);
}

export default db;
