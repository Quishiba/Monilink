import Surreal from 'surrealdb.js';

let db: Surreal | null = null;

export async function getDb() {
  if (db) return db;

  db = new Surreal();
  
  await db.connect(process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT!, {
    namespace: process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE!,
    database: process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE!,
  });

  await db.signin({
    username: 'root',
    password: process.env.EXPO_PUBLIC_RORK_DB_TOKEN!,
  });

  console.log('✅ Database connected');
  return db;
}

export async function query<T = any>(sql: string, vars?: Record<string, any>): Promise<T[]> {
  const database = await getDb();
  const result = await database.query<T[][]>(sql, vars);
  return result[0] || [];
}

export async function select<T = any>(table: string, id?: string): Promise<T | T[]> {
  const database = await getDb();
  return (id ? await database.select(`${table}:${id}`) : await database.select(table)) as T | T[];
}

export async function create<T = any>(table: string, data: any): Promise<T> {
  const database = await getDb();
  return database.create(table, data) as Promise<T>;
}

export async function update<T = any>(table: string, id: string, data: any): Promise<T> {
  const database = await getDb();
  return database.update(`${table}:${id}`, data) as Promise<T>;
}

export async function remove(table: string, id: string): Promise<void> {
  const database = await getDb();
  await database.delete(`${table}:${id}`);
}
