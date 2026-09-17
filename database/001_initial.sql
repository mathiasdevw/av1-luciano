CREATE TABLE IF NOT EXISTS av1_attempts (
 id UUID PRIMARY KEY,
 secret_hash TEXT NOT NULL,
 nickname VARCHAR(24) NOT NULL,
 bank_version TEXT NOT NULL,
 question_ids JSONB NOT NULL,
 started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 finished_at TIMESTAMPTZ,
 score INTEGER CHECK (score BETWEEN 0 AND 25),
 answers JSONB
);
CREATE INDEX IF NOT EXISTS idx_av1_attempts_ranking
 ON av1_attempts (bank_version, score DESC, finished_at ASC)
 WHERE finished_at IS NOT NULL;
