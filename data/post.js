import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: import.meta.env.VITE_DATA_USER,
  password: import.meta.env.VITE_DATA_PASS,
  host: import.meta.env.VITE_DATA_HOST,
  database: import.meta.env.VITE_DATA_NAME,
  port: import.meta.env.VITE_DATA_PORT,
});
