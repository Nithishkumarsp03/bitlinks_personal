-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2024 at 05:42 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bitlinks`
--

-- --------------------------------------------------------

--
-- Table structure for table `address_table`
--

CREATE TABLE `address_table` (
  `id` int(11) NOT NULL,
  `address_column` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `address_table`
--

INSERT INTO `address_table` (`id`, `address_column`, `status`) VALUES
(1, 'Chennai', 0),
(2, 'Delhi', 0),
(3, 'Bangalore', 1),
(4, 'Coimbatore', 1),
(5, 'VELLORE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `alumni_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `graduatedyear` int(11) DEFAULT NULL,
  `phonenumber` varchar(255) DEFAULT NULL,
  `companyaddress` varchar(255) DEFAULT NULL,
  `Alumni_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`alumni_id`, `person_id`, `name`, `batch`, `graduatedyear`, `phonenumber`, `companyaddress`, `Alumni_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `company_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `companyname` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `companyaddress` varchar(255) DEFAULT NULL,
  `websiteurl` varchar(255) DEFAULT NULL,
  `scale` varchar(255) DEFAULT NULL,
  `payscale` varchar(255) DEFAULT NULL,
  `Company_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`company_id`, `person_id`, `companyname`, `position`, `experience`, `role`, `companyaddress`, `websiteurl`, `scale`, `payscale`, `Company_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_table`
--

CREATE TABLE `company_table` (
  `id` int(11) NOT NULL,
  `company_column` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company_table`
--

INSERT INTO `company_table` (`id`, `company_column`, `status`) VALUES
(1, 'Microsoft', 1),
(2, 'Google', 1),
(3, 'Amazon', 0),
(4, 'ZOHO', 0),
(5, 'Cadence', 0),
(7, 'TARNE TECHNOLOGIES', 1),
(8, 'CAP Gemini', 1),
(9, 'BIOZEEN', 1),
(10, 'VVDN Technologies', 1),
(11, 'Analog Devices', 1),
(12, '3D Pheonix Sy', 1),
(13, 'City Corp Service India, pvt ltd', 1),
(14, 'TOPOU construction ', 1);

-- --------------------------------------------------------

--
-- Table structure for table `consultancy`
--

CREATE TABLE `consultancy` (
  `consultancy_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `ifconsultancy` enum('yes','no') DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `skillset` varchar(255) DEFAULT NULL,
  `eligibility` varchar(255) DEFAULT NULL,
  `projecttype` varchar(255) DEFAULT NULL,
  `Consultancy_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `consultancy`
--

INSERT INTO `consultancy` (`consultancy_id`, `person_id`, `ifconsultancy`, `role`, `domain`, `skillset`, `eligibility`, `projecttype`, `Consultancy_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `domain_table`
--

CREATE TABLE `domain_table` (
  `id` int(11) NOT NULL,
  `domain_column` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `domain_table`
--

INSERT INTO `domain_table` (`id`, `domain_column`, `status`) VALUES
(1, 'Both Software & Hardware', 1),
(2, 'Software', 1),
(3, 'ECE/EEE/EIE', 1),
(4, 'MECH/MTRS', 1),
(7, 'AGRI', 1),
(8, 'BIOTECH', 1);

-- --------------------------------------------------------

--
-- Table structure for table `expertise`
--

CREATE TABLE `expertise` (
  `expertise_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `specialistskills` varchar(255) DEFAULT NULL,
  `skillset` varchar(255) DEFAULT NULL,
  `Expertise_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `expertise`
--

INSERT INTO `expertise` (`expertise_id`, `person_id`, `domain`, `specialistskills`, `skillset`, `Expertise_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `history_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `agent` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `scheduleddate` varchar(255) DEFAULT NULL,
  `visited1` varchar(255) DEFAULT NULL,
  `visited2` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `emailSent` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`history_id`, `person_id`, `agent`, `email`, `type`, `note`, `purpose`, `datetime`, `scheduleddate`, `visited1`, `visited2`, `points`, `status`, `emailSent`) VALUES
(1, 1, 'NITHISH KUMAR S P', 'nithishkumar.cs23@bitsathy.ac.in', 'Reschedule Call', 'Get requirements about the next visit', 'Industrial Advisor/Reviewer', '2024-10-15 11:34:59', '2024-10-15 19:33:56', NULL, NULL, 0, 1, 1),
(2, 1, 'NITHISH KUMAR S P', 'nithishkumar.cs23@bitsathy.ac.in', 'Reschedule Call', 'Get to know about the current revolution of industry', 'Handson Workshop', '2024-10-15 11:36:06', '2024-10-15 12:30:00', NULL, NULL, 0, 1, 1),
(3, 1, 'NITHISH KUMAR S P', 'nithishkumar.cs23@bitsathy.ac.in', 'Call', 'Spoke a call regarding the next visit', '', '2024-10-16 10:01:48', '2024-10-16 10:01:25', NULL, NULL, 3, 0, 0);

--
-- Triggers `history`
--
DELIMITER $$
CREATE TRIGGER `update_person_points_summary` AFTER INSERT ON `history` FOR EACH ROW BEGIN
    DECLARE weeks_elapsed INT;
    DECLARE time_gap INT;
    DECLARE current_total_points DECIMAL(10,2);
    DECLARE last_update_time DATETIME;
    DECLARE existing_reduction DECIMAL(10,2);
    DECLARE new_reduction DECIMAL(10,2);
    DECLARE now_time DATETIME;

    SET now_time = NOW(); -- Set NOW() once and reuse
    SET current_total_points = 0;
    SET last_update_time = NULL;
    SET existing_reduction = 0.00;
    SET new_reduction = 0.00;

    -- Check if person_id exists in the summary table
    SELECT total_points, last_updated, reduction INTO current_total_points, last_update_time, existing_reduction
    FROM person_points_summary
    WHERE person_id = NEW.person_id
    LIMIT 1;

    IF last_update_time IS NOT NULL THEN
        -- Calculate the time gap in months
        SET time_gap = TIMESTAMPDIFF(MONTH, last_update_time, now_time);

        IF time_gap < 1 THEN
            -- If the time gap is less than 1 month, include existing reduction
            SET current_total_points = current_total_points + NEW.points;
            -- Reset reduction as it's already included
            SET existing_reduction = 0.00;  
        ELSE
            -- If the time gap is 1 month or more, do not include the reduction
            SET current_total_points = current_total_points + NEW.points;
        END IF;

        -- Update the person_points_summary table
        UPDATE person_points_summary
        SET total_points = current_total_points,
            last_updated = now_time,
            reduction = existing_reduction
        WHERE person_id = NEW.person_id;
    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `interactions`
--

CREATE TABLE `interactions` (
  `id` int(11) NOT NULL,
  `interaction` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `interactions`
--

INSERT INTO `interactions` (`id`, `interaction`, `status`) VALUES
(1, 'Guest Lecture/Seminar', 1),
(2, 'Handson Workshop', 1),
(3, 'One Credit Course', 1),
(4, 'Conference/Symposium Guest', 1),
(5, 'Industrial Advisor/Reviewer', 1),
(6, 'Board of studies', 1),
(7, 'Alumni Interaction', 1),
(8, 'Consultancy', 1),
(9, 'MoU', 1),
(10, 'Laboratory Establishment/Center of Excellence', 1),
(11, 'R&D', 1),
(12, 'Placement Drive', 1),
(13, 'Internship Offer', 1),
(14, 'General Visit', 1);

-- --------------------------------------------------------

--
-- Table structure for table `internship`
--

CREATE TABLE `internship` (
  `internship_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `ifinternship` enum('yes','no') DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `skillset` varchar(255) DEFAULT NULL,
  `eligibility` varchar(255) DEFAULT NULL,
  `projecttype` varchar(255) DEFAULT NULL,
  `Internship_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `internship`
--

INSERT INTO `internship` (`internship_id`, `person_id`, `ifinternship`, `role`, `domain`, `skillset`, `eligibility`, `projecttype`, `Internship_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `ROLE` enum('user','admin') NOT NULL,
  `STATUS` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`ID`, `NAME`, `EMAIL`, `ROLE`, `STATUS`) VALUES
(1, 'NITHISH KUMAR S P', 'nithishkumar.cs23@bitsathy.ac.in', 'admin', 1),
(2, 'THAYANITHI S', 'thayanithi.cs23@bitsathy.ac.in', 'user', 1);

-- --------------------------------------------------------

--
-- Table structure for table `others`
--

CREATE TABLE `others` (
  `others_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `outcome`
--

CREATE TABLE `outcome` (
  `outcome_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `eventname` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `Outcome_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `outcome`
--

INSERT INTO `outcome` (`outcome_id`, `person_id`, `eventname`, `date`, `description`, `Outcome_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personalinfo`
--

CREATE TABLE `personalinfo` (
  `person_id` int(10) UNSIGNED NOT NULL,
  `useremail` varchar(255) NOT NULL,
  `profile` varchar(255) DEFAULT '/uploads/1723435093639.jpg',
  `fullname` varchar(255) NOT NULL,
  `phonenumber` varchar(255) NOT NULL,
  `age` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `visitingcard` varchar(255) DEFAULT NULL,
  `linkedinurl` varchar(1000) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `shortdescription` varchar(255) DEFAULT NULL,
  `hashtags` varchar(255) DEFAULT NULL,
  `spoc` varchar(255) NOT NULL DEFAULT 'no',
  `Completion` int(255) DEFAULT NULL,
  `overall_completion` int(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `sub_id` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `personalinfo`
--

INSERT INTO `personalinfo` (`person_id`, `useremail`, `profile`, `fullname`, `phonenumber`, `age`, `email`, `dob`, `rating`, `visitingcard`, `linkedinurl`, `address`, `shortdescription`, `hashtags`, `spoc`, `Completion`, `overall_completion`, `reason`, `timestamp`, `sub_id`, `status`) VALUES
(1, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'NITHISH KUMAR S P', '8903342911', '19', 'nithishkumar.cs23@bitsathy.ac.in', '2005-11-02', 'Higly Recommended', NULL, 'www.linkedin.com/in/nithish-kumar-s-p-b5295828b', 'Mettupalayam, Coimbatore', 'Fouder of Product based development company, Fullstack developer, Tech enthusiast, Entreperenur', '#applicationengineer #startup #founder', 'no', 100, 100, NULL, '2024-10-15 11:33:49', 0, 1),
(4, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'THAYANITHI S', '9025391287', '', 'thayanithi.cs23@bitsathy.ac.in', '1899-11-29', '', NULL, '', '', '', '', 'no', 40, 40, NULL, '2024-10-17 17:24:28', 1, 1),
(5, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'DHANU SHRI V', '989034839', '', 'dhanushri.ec23@bitsathy.ac.in', '0000-00-00', '', NULL, '', '', '', '', 'no', 25, 7, NULL, '2024-10-17 17:25:16', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `person_points_summary`
--

CREATE TABLE `person_points_summary` (
  `summary_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `total_points` decimal(10,2) DEFAULT 10.00,
  `rank` int(11) DEFAULT 0,
  `last_updated` datetime DEFAULT NULL,
  `reduction` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `person_points_summary`
--

INSERT INTO `person_points_summary` (`summary_id`, `person_id`, `total_points`, `rank`, `last_updated`, `reduction`) VALUES
(1, 1, '13.00', 1, '2024-10-16 10:01:48', '0.00'),
(3, 4, '10.00', -1, '2024-10-17 17:24:28', '0.00'),
(4, 5, '10.00', 0, '2024-10-17 17:25:16', '0.00');

--
-- Triggers `person_points_summary`
--
DELIMITER $$
CREATE TRIGGER `update_rank` BEFORE UPDATE ON `person_points_summary` FOR EACH ROW BEGIN
   IF NEW.rank = 0 THEN
      IF NEW.total_points <= 10 THEN
         SET NEW.rank = 0;
      ELSEIF NEW.total_points > 10 AND NEW.total_points <= 25 THEN
         SET NEW.rank = 1;
      ELSEIF NEW.total_points > 25 AND NEW.total_points <= 50 THEN
         SET NEW.rank = 2;
      ELSE
         SET NEW.rank = 3;
      END IF;
   END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `placement`
--

CREATE TABLE `placement` (
  `placement_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `ifplacement` enum('yes','no') DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `skillset` varchar(255) DEFAULT NULL,
  `eligibility` varchar(255) DEFAULT NULL,
  `Placement_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `placement`
--

INSERT INTO `placement` (`placement_id`, `person_id`, `ifplacement`, `role`, `domain`, `skillset`, `eligibility`, `Placement_Completion`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `previousexperience`
--

CREATE TABLE `previousexperience` (
  `experience_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `ifexperience` enum('yes','no') DEFAULT NULL,
  `companyname` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `companyaddress` varchar(255) DEFAULT NULL,
  `Experience_Completion` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `previousexperience`
--

INSERT INTO `previousexperience` (`experience_id`, `person_id`, `ifexperience`, `companyname`, `position`, `experience`, `role`, `companyaddress`, `Experience_Completion`) VALUES
(1, 1, NULL, '', NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, '', NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, '', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_table`
--

CREATE TABLE `role_table` (
  `id` int(11) NOT NULL,
  `role_column` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `skillset_table`
--

CREATE TABLE `skillset_table` (
  `id` int(11) NOT NULL,
  `skillset_column` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address_table`
--
ALTER TABLE `address_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`alumni_id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `company_table`
--
ALTER TABLE `company_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consultancy`
--
ALTER TABLE `consultancy`
  ADD PRIMARY KEY (`consultancy_id`);

--
-- Indexes for table `domain_table`
--
ALTER TABLE `domain_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expertise`
--
ALTER TABLE `expertise`
  ADD PRIMARY KEY (`expertise_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `interactions`
--
ALTER TABLE `interactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `internship`
--
ALTER TABLE `internship`
  ADD PRIMARY KEY (`internship_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `others`
--
ALTER TABLE `others`
  ADD PRIMARY KEY (`others_id`);

--
-- Indexes for table `outcome`
--
ALTER TABLE `outcome`
  ADD PRIMARY KEY (`outcome_id`);

--
-- Indexes for table `personalinfo`
--
ALTER TABLE `personalinfo`
  ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `person_points_summary`
--
ALTER TABLE `person_points_summary`
  ADD PRIMARY KEY (`summary_id`);

--
-- Indexes for table `placement`
--
ALTER TABLE `placement`
  ADD PRIMARY KEY (`placement_id`);

--
-- Indexes for table `previousexperience`
--
ALTER TABLE `previousexperience`
  ADD PRIMARY KEY (`experience_id`);

--
-- Indexes for table `role_table`
--
ALTER TABLE `role_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skillset_table`
--
ALTER TABLE `skillset_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address_table`
--
ALTER TABLE `address_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `alumni_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `company_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `company_table`
--
ALTER TABLE `company_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `consultancy`
--
ALTER TABLE `consultancy`
  MODIFY `consultancy_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `domain_table`
--
ALTER TABLE `domain_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expertise`
--
ALTER TABLE `expertise`
  MODIFY `expertise_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `interactions`
--
ALTER TABLE `interactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `internship`
--
ALTER TABLE `internship`
  MODIFY `internship_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `others`
--
ALTER TABLE `others`
  MODIFY `others_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `outcome`
--
ALTER TABLE `outcome`
  MODIFY `outcome_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `personalinfo`
--
ALTER TABLE `personalinfo`
  MODIFY `person_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `person_points_summary`
--
ALTER TABLE `person_points_summary`
  MODIFY `summary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `placement`
--
ALTER TABLE `placement`
  MODIFY `placement_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `previousexperience`
--
ALTER TABLE `previousexperience`
  MODIFY `experience_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `role_table`
--
ALTER TABLE `role_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `skillset_table`
--
ALTER TABLE `skillset_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `weekly_points_reduction` ON SCHEDULE EVERY 1 WEEK STARTS '2024-08-25 11:21:55' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE person_points_summary
    SET 
        reduction = reduction + (total_points * 0.01),  
        total_points = total_points * 0.99;            
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
