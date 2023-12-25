import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path'

const currentWorkingDirectory = process.cwd();
const absolutePath = path.join(currentWorkingDirectory, 'db_config.json');
const jsonString = fs.readFileSync(absolutePath, 'utf-8');
const dbConfig = JSON.parse(jsonString);

export const pool = new Pool(dbConfig);
