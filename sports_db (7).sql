-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2025 at 05:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sports_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities_registration`
--

CREATE TABLE `activities_registration` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `registration_type` varchar(100) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `school_id` varchar(100) NOT NULL,
  `activity_option` varchar(191) NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities_registration`
--

INSERT INTO `activities_registration` (`id`, `user_id`, `registration_type`, `name`, `email`, `school_id`, `activity_option`, `status`, `created_at`) VALUES
(1, 2, 'team', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'E-Sports Competition', 'Rejected', '2025-11-21 17:28:32'),
(2, 3, 'individual', 'Yhajj Magusib', 'yfmagusib@paterostechnologicalcollege.edu.ph', '23BSIT-0425', 'Table Tennis', 'Pending', '2025-11-27 13:41:26'),
(3, 2, 'individual', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Chess Tournament', 'Pending', '2025-11-27 13:51:04'),
(4, 3, 'team', 'Yhajj Magusib', 'yfmagusib@paterostechnologicalcollege.edu.ph', '23BSIT-0425', 'Volleyball Game', 'Pending', '2025-11-27 14:34:45'),
(5, 2, 'individual', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Track and Field', 'Pending', '2025-11-27 14:39:07'),
(6, 2, 'individual', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Chess Tournament', 'Rejected', '2025-11-27 14:44:32'),
(7, 2, 'individual', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Track and Field', 'Rejected', '2025-11-27 14:47:06'),
(8, 7, 'individual', 'Cheslyn De Belen', 'cdbelen@paterostechnologicalcollege.edu.ph', '23BSIT-0003', 'Table Tennis', 'Rejected', '2025-12-09 02:33:34'),
(9, 2, 'individual', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Table Tennis', 'Pending', '2025-12-09 17:45:08'),
(10, 2, 'individual', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Table Tennis', 'Pending', '2025-12-09 17:45:59');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `posted_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `message`, `posted_by`, `created_at`) VALUES
(1, 'Basketball Team Recruitment', 'The basket ball team wants to recruit the new member. You can register now.', 1, '2025-11-25 08:22:20'),
(2, 'Volleyball Team Recruitment', 'The volleyball team wants to recruit the new members. You can now register', 1, '2025-11-25 08:35:20'),
(4, 'Table Tennis Team Recruitment', 'The Table Tennis team wants to recruit the new member. You can register now.', 1, '2025-12-09 02:48:12'),
(5, 'Badminton Team Recruitment', 'Registration for badminton team is now open.', 1, '2025-12-09 03:44:49');

-- --------------------------------------------------------

--

CREATE TABLE `clubs` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `achievements` text DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `coach` varchar(191) DEFAULT NULL,
  `current_members` int(11) DEFAULT 0,
  `training_schedule` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add created_by column to clubs
ALTER TABLE `clubs`
  ADD COLUMN `created_by` int(10) UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT `fk_clubs_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `name`, `description`, `achievements`, `picture`, `coach`, `current_members`, `training_schedule`, `created_at`) VALUES
(1, 'Basketball', 'Basketball is a fast-paced team sport played by two teams of five players who score by shooting a ball through a hoop. The objective is to outscore the opposing team by getting the ball through the defender\'s elevated hoop on a rectangular court. Key actions in the game include shooting, dribbling, passing, and defense, with a field goal being worth two or three points and fouls resulting in one-point free throws. ', 'Active Participants LCUAA', 'club_1764581175821.jpg', 'Mr. Clark Kim Ongpauco', 15, 'Mon, Wed, Friday - 12:00 PM - 3:00 PM', '2025-11-20 13:21:20'),
(2, 'Volleyball Mens', 'Men\'s volleyball is a fast-paced, powerful team sport played by two teams of six players on a court divided by a high net, with the objective of scoring points by landing the ball on the opponent\'s side. Matches are decided by the best of three or five sets. ', 'Active Participation in LCUAA', 'club_1764582234825.jpg', 'Mr. Kim Estebes', 17, 'Wed, Fri - 1:00 PM - 3:00 PM', '2025-11-20 13:24:10'),
(3, 'Table Tennis', 'It\'s a fast-paced indoor sports between two or four players. Players needs to hit the ball back and fourth across the table using racket or paddle, the player should aim to land the ball in the opponents side to have a score. The sports emphasizes speed, reflexes and precision.\r\n', 'Cluster Meet (Gold), District Meet (Gold), Division Meet (Gold) , Regional Meet (Silver) , LCUAA\r\n', 'club_1764582682766.jpg', 'MR. Dave Panopio', 9, 'Thurs, Fri - 9:00 AM - 4:00 PM', '2025-11-20 13:25:01'),
(4, 'Atheletics', 'TBA', 'Silver Medalist 1 LCUAA', 'club_1764582765120.jpg', 'Mr. Amie Berja', 5, 'TBA', '2025-11-20 13:25:38'),
(5, 'CheerDance', 'TBA', 'Active Participation in LCUAA', 'club_1764582983272.jpg', 'Mr. Alvin Timbang', 39, 'TUE, THURS, SAT - 8:00 AM - 12:00 PM', '2025-11-20 13:41:54'),
(6, 'ESports', 'TBA', 'Gold Medalist LCUAA', 'club_1764582814046.jpg', 'Mr. Richard Pantalleon', 12, 'Mon, Tue, Wed, Thu, Fri - 6:00 PM - 9:00 PM', '2025-11-20 13:42:40'),
(7, 'Badminton', 'TBA', 'Active Participation in LCUAA', 'club_1764255315221.jpg', 'Mr. Serry Valerio', 15, 'TBA', '2025-11-27 14:55:15'),
(8, 'Volleyball Womens', 'TBA', 'Active Participation in LCUAA', 'club_1764577573172.jpg', 'Mrs. Faye Velitario', 15, 'Wed, Frid - 1:00 PM - 3:00 PM', '2025-11-27 16:40:20'),
(9, 'Chess', 'TBA', 'Bronze Medalist ', 'club_1764577585718.jpg', 'Mr. Steve Frank', 9, 'TUE, WED - 8:00 AM - 12:00 PM', '2025-11-27 16:43:26'),
(10, 'MR AND MS LCUAAA', 'TBA', 'Silver Medalist 13th LCUAA\r\nMr And Ms Friendship - 14th MR And MS LCUAA', 'club_1764577598449.jpg', 'Mr. Sonny Hernandez', 0, 'TBA', '2025-11-27 16:43:54');

-- --------------------------------------------------------

--

CREATE TABLE `club_registration` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `club_id` int(10) UNSIGNED DEFAULT NULL,
  `club_option` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `club_registration`
--

INSERT INTO `club_registration` (`id`, `user_id`, `club_option`, `name`, `email`, `student_id`, `status`, `created_at`) VALUES
(1, 2, 'ESports', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Approved', '2025-11-21 17:27:56'),
(2, 3, 'Basketball', 'Yhajj Magusib', 'yfmagusib@paterostechnologicalcollege.edu.ph', '23BSIT-0425', 'Approved', '2025-11-21 17:31:23'),
(4, 3, 'Atheletics', 'Yhajj Magusib', 'yfmagusib@paterostechnologicalcollege.edu.ph', '23BSIT-0425', 'Pending', '2025-11-27 13:44:19'),
(5, 2, 'Atheletics', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Pending', '2025-11-27 13:50:20'),
(6, 2, 'Table Tennis', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Pending', '2025-11-27 14:20:24'),
(8, 2, 'Basketball', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Approved', '2025-11-27 14:42:00'),
(11, 2, 'CheerDance', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Pending', '2025-12-09 17:38:35'),
(13, 2, 'ESports', 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', 'Pending', '2025-12-09 17:43:58');

-- --------------------------------------------------------

--

CREATE TABLE `events` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add created_by column to events
ALTER TABLE `events`
  ADD COLUMN `created_by` int(10) UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT `fk_events_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `venue`, `event_date`, `start_time`, `created_at`) VALUES
(1, 'Basketball Game', 'Finals game for the basketball league.  BSIT vs BSOA. ', 'Kanluran Court', '2025-11-28', '15:00:00', '2025-11-24 09:19:07'),
(2, 'Table  Tennis Game', 'Semi Finals Game for BSIT and BSOA team', 'PTC Main Building', '2025-12-11', '10:00:00', '2025-12-09 02:46:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `fullname` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `studentid` varchar(12) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `studentid`, `password`, `avatar`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@paterostechnologicalcollege.edu.ph', '23BSIT-0000', '$2b$10$izsY39cuo/w5rc9Q9oioJ.skWUUT3qof49RyXOG3n9imbF0u3C1ka', 'avatar_1_1763643913665.jpg', 'admin', '2025-11-20 12:32:46'),
(2, 'Student', 'student@paterostechnologicalcollege.edu.ph', '23BSIT-0001', '$2b$10$Bw3f/Cn4JzOzU4Aj0xQoV.Nuk1xfiAcS67b3cMu/RWUZRC4XZ3jqe', 'avatar_2_1763642542390.jpg', 'student', '2025-11-20 12:35:57'),
(3, 'Yhajj Magusib', 'yfmagusib@paterostechnologicalcollege.edu.ph', '23BSIT-0425', '$2b$10$pvJ3zz87SvB6kCAaK8FpMuURVebxvbpK9cgx9E3jWo0trBO5iv.4K', NULL, 'student', '2025-11-21 17:30:35'),
(7, 'Cheslyn De Belen', 'cdbelen@paterostechnologicalcollege.edu.ph', '23BSIT-0003', '$2b$10$l/7bnA3oAl3yTEQgEbrHS.TQgOvNRgQ/wpVgs2uzwLB7OZopaqdo6', 'avatar_7_1765251378083.jpg', 'student', '2025-12-09 02:27:04'),
(8, 'Jerwin Fabian', 'jefabian@paterostechnologicalcollege.edu.ph', '23BSIT-0466', '$2b$10$C3CGw1twbvnVEWJHXc3tAeERoTq/fAbYk08PTUmcDKXvoioReyr4S', NULL, 'student', '2025-12-09 03:27:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities_registration`
--
ALTER TABLE `activities_registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ar_user_id` (`user_id`),
  ADD KEY `idx_ar_email` (`email`),
  ADD KEY `idx_ar_school_id` (`school_id`),
  ADD KEY `idx_ar_status` (`status`),
  ADD KEY `idx_ar_created_at` (`created_at`),
  ADD KEY `idx_ar_registration_type` (`registration_type`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ann_posted_by` (`posted_by`);

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_clubs_name` (`name`);

--
ALTER TABLE `club_registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cr_user_id` (`user_id`),
  ADD KEY `idx_cr_club_id` (`club_id`),
  ADD KEY `idx_cr_email` (`email`),
  ADD KEY `idx_cr_student_id` (`student_id`),
  ADD KEY `idx_cr_status` (`status`),
  ADD KEY `idx_cr_created_at` (`created_at`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_events_date` (`event_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities_registration`
--
ALTER TABLE `activities_registration`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `club_registration`
--
ALTER TABLE `club_registration`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities_registration`
--
ALTER TABLE `activities_registration`
  ADD CONSTRAINT `fk_ar_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `fk_ann_user` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
ALTER TABLE `club_registration`
  ADD CONSTRAINT `fk_cr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `club_registration`
  ADD CONSTRAINT `fk_cr_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
