import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  port: process.env.DBPORT,
  ssl: true
});



