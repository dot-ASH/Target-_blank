import pkg from 'pg';
const { Pool } = pkg;
// import fs from 'fs';
// import path from 'path'

// const currentWorkingDirectory = process.cwd();
// const absolutePath = path.join(currentWorkingDirectory, 'db_config.json');
// const jsonString = fs.readFileSync(absolutePath, 'utf-8');
// const dbConfig = JSON.parse(jsonString);

// export const pool = new Pool(dbConfig);

export const pool = new Pool({
  user: process.env.VITE_USER,
  password: process.env.VITE_DATA_PASS,
  host: process.env.VITE_DATA_HOST,
  database: process.env.VITE_DATA_NAME,
  port: process.env.VITE_DATA_PORT,
  ssl: true
});



