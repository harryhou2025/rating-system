import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDB(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: './rating_sys.db',
      driver: sqlite3.Database,
    });
  }
  return db;
}

export default getDB;
