import mysql from "mysql2/promise";
// local database xampp cntrol by phpmyadmin
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "skillbridge",
  port: 3307,
});


// cloude database  aiven.io

// export const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });