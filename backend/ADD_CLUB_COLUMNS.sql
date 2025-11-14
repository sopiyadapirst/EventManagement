-- Run these statements in your MySQL database if the `clubs` table is missing the description or achievements columns.
-- Make a backup before running.

ALTER TABLE clubs
  ADD COLUMN IF NOT EXISTS description TEXT NULL;

ALTER TABLE clubs
  ADD COLUMN IF NOT EXISTS achievements TEXT NULL;

-- Note: "IF NOT EXISTS" in ADD COLUMN is supported in MySQL 8.0.16+; if your MySQL version is older,
-- run the following instead (use only if you know the columns don't exist):
-- ALTER TABLE clubs ADD COLUMN description TEXT NULL;
-- ALTER TABLE clubs ADD COLUMN achievements TEXT NULL;
