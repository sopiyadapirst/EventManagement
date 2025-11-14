-- ============================================
-- Event Management System - Clubs Table Schema
-- Database: sports_db
-- ============================================

-- Create clubs table with all required columns
CREATE TABLE IF NOT EXISTS clubs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  achievements TEXT NULL,
  picture VARCHAR(255) NULL COMMENT 'Stores filename (e.g. club_123456789.jpg)',
  coach VARCHAR(255) NULL,
  current_members INT NULL,
  training_schedule TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data (insert after schema is ready)
-- ============================================

INSERT INTO clubs (name, description, achievements, picture, coach, current_members, training_schedule, created_at)
VALUES 
(
  'Basketball',
  'High-energy basketball club for competitive and casual players. Develop skills in shooting, passing, and team strategies.',
  'Won 1st place in Basketball Tournament',
  'club_1762939496975.jpg',
  'dasgaf',
  10,
  'Mon, Wed, Friday - 1:00 PM to 3:00 PM',
  '2025-11-12 17:24:57'
),
(
  'Volleyball',
  'Competitive volleyball club. Join us to learn teamwork, coordination, and athletic excellence.',
  'Regional Volleyball Champion',
  'club_volleyball_001.jpg',
  'Jane Smith',
  18,
  'Tue & Thu, 4-6 PM',
  '2025-11-10 10:00:00'
),
(
  'Chess Club',
  'Strategic thinking and competitive chess. All skill levels welcome.',
  'Chess Tournament Winner',
  'club_chess_001.jpg',
  'Mike Lee',
  12,
  'Fri, 2-4 PM',
  '2025-11-08 15:30:00'
),
(
  'Badminton',
  'Fast-paced badminton training. Improve footwork, agility, and tactical play.',
  'Zone Champion',
  'club_badminton_001.jpg',
  'Coach Rodriguez',
  15,
  'Mon & Wed, 5-7 PM',
  '2025-11-05 08:00:00'
),
(
  'Table Tennis',
  'Precision and speed. Develop spin techniques and competitive strategies.',
  'Inter-college Tournament Runner-up',
  'club_tabletennis_001.jpg',
  'Coach Chen',
  8,
  'Tue & Thu, 3-5 PM',
  '2025-11-01 12:00:00'
);

-- ============================================
-- Helper Queries
-- ============================================

-- View all clubs
-- SELECT * FROM clubs ORDER BY id DESC;

-- View schema
-- DESCRIBE clubs;

-- Count clubs by coach
-- SELECT coach, COUNT(*) as total_clubs FROM clubs GROUP BY coach;

-- Find clubs created in last 7 days
-- SELECT * FROM clubs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Update a specific club
-- UPDATE clubs SET description = 'New description', achievements = 'New achievements' WHERE id = 1;

-- Delete a club (be careful!)
-- DELETE FROM clubs WHERE id = 1;

-- Normalize picture filenames (remove /uploads/ prefix if present)
-- UPDATE clubs SET picture = TRIM(LEADING '/uploads/' FROM picture) WHERE picture LIKE '/uploads/%';

-- ============================================
-- Notes
-- ============================================
-- 1. picture column stores only the filename (e.g. club_123456789.jpg)
--    Frontend and backend will prepend /uploads/ when serving images
--
-- 2. description and achievements are TEXT columns for longer content
--
-- 3. created_at is automatically set when a row is inserted
--    updated_at is automatically updated on any row modification
--
-- 4. The table uses InnoDB engine for transaction support and foreign key constraints
--
-- 5. UTF8MB4 charset supports emoji and special characters
-- ============================================
