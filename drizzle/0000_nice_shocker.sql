CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`secret` text NOT NULL,
	`nickname` text NOT NULL,
	`ids` text NOT NULL,
	`started` integer NOT NULL,
	`finished` integer,
	`score` integer,
	`answers` text
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_ranking` ON `attempts` (`score`,`finished`);