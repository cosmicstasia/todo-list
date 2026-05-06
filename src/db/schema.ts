import { sqliteTable } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: t.integer('id').primaryKey({ autoIncrement: true }),
  title: t.text('title'),
  content: t.text('content'),
  createdAt: t
    .int('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: t
    .int('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});
