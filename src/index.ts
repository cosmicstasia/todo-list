import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { tasks } from './db/schema';
import { eq } from 'drizzle-orm';

const app = new Hono();
app.use("*", cors())

const sqlite = new Database('sqlite.db');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title TEXT,
    content TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

const db = drizzle(sqlite);

app.get('/', async c => {
  return c.json({ ok: true });
});

app.post('/tasks', async c => {
  const body = await c.req.json();

  const created = db
    .insert(tasks)
    .values({
      content: body.content,
      title: body.title,
    })
    .returning()
    .get();

  return c.json(created, 201);
});

app.get('/tasks', async c => {
  const allTasks = db.select().from(tasks).all();
  return c.json(allTasks);
})

app.delete('/tasks/:id', async c => {
  const id = Number(c.req.param('id'));

  const deleted = db.delete(tasks).where(eq(tasks.id, id)).returning().get();

  return c.json(deleted);
});

app.patch('/tasks/:id', async c => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const updated = db
    .update(tasks)
    .set({
      title: body.title,
      content: body.content,
    })
    .where(eq(tasks.id, id))
    .returning()
    .get();
  if (!updated) {
    return c.json({ message: 'Task not found' }, 404);
  }
  return c.json(updated);
});

app.get('/tasks/:id', async c => {
  const id = Number(c.req.param('id'));
  const task = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!task) {
    return c.json({ message: 'Task not found' }, 404);
  }
  return c.json(task);
});

export default app;
