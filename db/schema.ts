import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const attempts=sqliteTable('attempts',{
 id:text('id').primaryKey(),secret:text('secret').notNull(),nickname:text('nickname').notNull(),
 ids:text('ids').notNull(),started:integer('started').notNull(),finished:integer('finished'),
 score:integer('score'),answers:text('answers'),
},t=>[index('idx_attempts_ranking').on(t.score,t.finished)]);
