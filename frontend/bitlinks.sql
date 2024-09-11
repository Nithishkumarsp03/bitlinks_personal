-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2024 at 11:54 AM
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
(1, 'Chennai', 1),
(2, 'Delhi', 1),
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
  `name` varchar(255) NOT NULL,
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
(1, 1, '', NULL, NULL, NULL, NULL, NULL),
(2, 2, 'ASIRVATHAM JHONY JACOB', NULL, NULL, '+914442990976', 'Chennai', 60),
(3, 3, '', NULL, NULL, NULL, NULL, NULL),
(4, 4, '', NULL, NULL, '8883992053', 'Coimbatore', 40),
(5, 5, 'PRAVEEN P', NULL, NULL, '97914 83137', 'Coimbatore', 60),
(6, 6, '', NULL, NULL, NULL, NULL, NULL),
(7, 7, '', NULL, NULL, NULL, NULL, NULL),
(8, 8, '', NULL, NULL, NULL, NULL, NULL),
(9, 9, '', NULL, NULL, NULL, NULL, NULL),
(10, 10, '', NULL, NULL, NULL, NULL, NULL),
(11, 11, '', NULL, NULL, NULL, NULL, NULL),
(12, 12, '', NULL, NULL, NULL, NULL, NULL),
(13, 13, '', NULL, NULL, NULL, NULL, NULL),
(14, 14, '', NULL, NULL, NULL, NULL, NULL),
(15, 15, '', NULL, NULL, NULL, NULL, NULL),
(16, 16, '', NULL, NULL, NULL, NULL, NULL),
(17, 17, '', NULL, NULL, NULL, NULL, NULL),
(18, 18, '', NULL, NULL, NULL, NULL, NULL);

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
(1, 1, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(2, 2, 'TARNE TECHNOLOGIES', NULL, NULL, NULL, 'Chennai', '', '', '', 40),
(3, 3, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(4, 4, 'CAP Gemini', NULL, NULL, NULL, 'Coimbatore', '', '', '', 40),
(5, 5, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(6, 6, 'BIOZEEN', NULL, NULL, NULL, 'Bangalore', '', '', '', 40),
(7, 7, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(8, 8, 'VVDN Technologies', NULL, NULL, NULL, 'Coimbatore', '', '', '', 40),
(9, 9, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(10, 10, NULL, NULL, NULL, 'Manager', 'Chennai', '', '', '', 40),
(11, 11, 'Analog Devices', NULL, NULL, NULL, 'Bangalore', '', '', '', 40),
(12, 12, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(13, 13, '3D Pheonix Sy', NULL, NULL, NULL, 'Coimbatore', '', '', '', 40),
(14, 14, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(15, 15, NULL, NULL, NULL, 'Assistant Vice President', 'Chennai', '', '', '', 40),
(16, 16, NULL, NULL, NULL, NULL, NULL, '', '', '', NULL),
(17, 17, 'TOPOU construction ', NULL, NULL, 'Managing Director ', 'Coimbatore', '', '', '', 60),
(18, 18, 'TOPOU construction ', 'Head', '5', 'Assistant Vice President', 'Chennai', 'google.com', 'Small', 'Below 3 Lakhs', 100);

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
(2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 13, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 18, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
(2, 2, '', '', '', 0),
(3, 3, NULL, NULL, NULL, NULL),
(4, 4, 'Software', '8 years - Full stack, IOT, Web applications', '', 33),
(5, 5, NULL, NULL, NULL, NULL),
(6, 6, '', 'BIOPROCESS', '', 33),
(7, 7, NULL, NULL, NULL, NULL),
(8, 8, '', 'Networking', '', 33),
(9, 9, NULL, NULL, NULL, NULL),
(10, 10, 'AGRI', '', '', 33),
(11, 11, '', 'Power Electronics', '', 33),
(12, 12, NULL, NULL, NULL, NULL),
(13, 13, '', '3D Scanning', '', 33),
(14, 14, NULL, NULL, NULL, NULL),
(15, 15, '', 'Data Engineer', '', 33),
(16, 16, NULL, NULL, NULL, NULL),
(17, 17, '', 'Construction ', '', 33),
(18, 18, 'AGRI', 'e', 'Full-stack', 100);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `history_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `agent` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `scheduleddate` datetime DEFAULT NULL,
  `visited1` varchar(255) DEFAULT NULL,
  `visited2` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`history_id`, `person_id`, `agent`, `type`, `note`, `purpose`, `datetime`, `scheduleddate`, `visited1`, `visited2`, `points`, `status`) VALUES
(1, 17, 'NITHISH KUMAR S P', 'Call', 'Call', '', '2024-09-05 15:23:22', '2024-09-05 05:53:06', NULL, NULL, 3, 0),
(2, 16, 'NITHISH KUMAR S P', 'Reschedule Call', 'Rescheduled', '', '2024-09-05 15:26:18', '2024-09-05 17:55:50', NULL, NULL, 1, 0),
(3, 18, 'NITHISH KUMAR S P', 'Missed Call', 'Missed', '', '2024-09-06 14:55:37', '2024-09-06 05:24:19', NULL, NULL, 0, 0),
(4, 18, 'NITHISH KUMAR S P', 'Missed Call', 'Test1', 'Test2', '2024-09-06 15:22:40', '2024-09-06 05:49:43', NULL, NULL, 0, 0),
(5, 18, 'NITHISH KUMAR S P', 'Incompleted Task', 'Test2', 'Test1', '2024-09-06 15:23:38', NULL, NULL, NULL, 0, 0),
(6, 10, 'NITHISH KUMAR S P', 'Missed Call', 'Missed', 'Test2', '2024-09-06 15:32:52', '2024-09-06 06:02:08', NULL, NULL, 0, 0);

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
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `incident_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `eventname` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 13, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 18, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
(2, 2, NULL, NULL, NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL),
(7, 7, NULL, NULL, NULL, NULL),
(8, 8, NULL, NULL, NULL, NULL),
(9, 9, NULL, NULL, NULL, NULL),
(10, 10, NULL, NULL, NULL, NULL),
(11, 11, NULL, NULL, NULL, NULL),
(12, 12, NULL, NULL, NULL, NULL),
(13, 13, NULL, NULL, NULL, NULL),
(14, 14, NULL, NULL, NULL, NULL),
(15, 15, NULL, NULL, NULL, NULL),
(16, 16, NULL, NULL, NULL, NULL),
(17, 17, NULL, NULL, NULL, NULL),
(18, 18, NULL, NULL, NULL, NULL);

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
  `linkedinurl` varchar(1000) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `shortdescription` varchar(255) DEFAULT NULL,
  `hashtags` varchar(255) DEFAULT NULL,
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

INSERT INTO `personalinfo` (`person_id`, `useremail`, `profile`, `fullname`, `phonenumber`, `age`, `email`, `linkedinurl`, `address`, `shortdescription`, `hashtags`, `Completion`, `overall_completion`, `reason`, `timestamp`, `sub_id`, `status`) VALUES
(1, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'RAJASEKAR L', '9890348391', '', '', '', '', 'Associate Tech Lead-Application Engineer.', '', 38, 7, NULL, '2024-09-05 10:15:19', 0, 1),
(2, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'SOMASUNDARAM S', '9619585332', '', 'somasundara@tranetechnologies.com', '', '', 'Associate Tech Lead-Application Engineer.', '#applicationengineer', 63, 30, NULL, '2024-09-05 10:16:41', 1, 1),
(3, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Dr K Anandakumar', '8903342911', '', '', '', '', '', '', 25, 5, NULL, '2024-09-05 10:48:20', 0, 1),
(4, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'KUMARAVEL', '8883992053', '', 'kumarpkvel@gmail.com', '', '', 'Technical Team lead ', '#teamlead', 63, 30, NULL, '2024-09-05 10:49:09', 3, 1),
(5, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'KIRUPA SANKAR M', '989034839', '', '', '', '', '', '', 25, 19, NULL, '2024-09-05 10:54:22', 0, 1),
(6, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'PRAVEEN P', '97914 83137', '', 'Praveen.p@biozeen.com', '', '', 'Senior Bioprocess Engineer', '#bioprocessengineer', 63, 26, NULL, '2024-09-05 10:55:34', 5, 1),
(7, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'RAMYA P', '9025391287', '', '', '', '', '', '', 25, 5, NULL, '2024-09-05 10:58:38', 0, 1),
(8, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Mr.Sumellan', '8973570395', '', 'sumellan.s@vvdntech.in', '', '', 'Senior Technical lead', '#technicallead', 63, 26, NULL, '2024-09-05 11:00:01', 7, 1),
(9, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Lakshmanan L S', '+9174023846731', '', 'lakshmanan.ls@vvdntech.in', '', 'Coimbatore', 'HR', '#hr', 75, 21, NULL, '2024-09-05 11:02:56', 7, 1),
(10, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'P.Sritha', '+916437434671', '', '', 'www.linkedin.com/in/nithish-kumar-s-p-b5295828b', '', '', '#sritha', 50, 21, NULL, '2024-09-05 11:04:34', 0, 1),
(11, 'thayanithi.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Vinoth Kumar.J', '77087447026', '', 'vinothkumar.jayaprakash@analog.com', '', '', 'Engineer', '#engineer', 63, 26, NULL, '2024-09-05 11:05:14', 10, 1),
(12, 'thayanithi.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Dr.Ramya P', '7543552911', '', '', '', '', '', '#ramya', 38, 7, NULL, '2024-09-05 11:07:07', 0, 1),
(13, 'thayanithi.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'U K NAWIN', '7904327878', '', 'admin@pheonix3dm.com', '', '', 'Manager', '#manager', 63, 23, NULL, '2024-09-05 11:07:58', 12, 1),
(14, 'thayanithi.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Dr. D. Deepa', '7347564839', '', '', '', '', '', '#deepa', 38, 7, NULL, '2024-09-05 11:10:08', 0, 1),
(15, 'thayanithi.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'A. Vijay', '9524356150', '', 'vijay.asokan@city.com', '', '', 'Assistant Vice President', '#assistantvicepresident', 63, 23, NULL, '2024-09-05 11:11:00', 14, 1),
(16, 'dhanusri.ec23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Preetha v ', 'nil', '', '', '', '', '', '#preetha', 38, 7, NULL, '2024-09-05 11:17:19', 0, 1),
(17, 'dhanusri.ec23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'Madhan kumar s', '9788176456', '', 'Topouconstruction@gmail.com', '', '', '', '#madhankumar', 50, 23, NULL, '2024-09-05 11:18:14', 16, 1),
(18, 'nithishkumar.cs23@bitsathy.ac.in', '/uploads/1723435093639.jpg', 'NITHISH KUMAR S P', '+918903342911', '', '', '', '', '', '', 25, 33, NULL, '2024-09-05 16:14:42', 10, 1);

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
(1, 1, '9.90', 0, '2024-09-05 10:15:19', '0.10'),
(2, 2, '9.90', 0, '2024-09-05 10:16:41', '0.10'),
(3, 3, '9.90', 0, '2024-09-05 10:48:20', '0.10'),
(4, 4, '9.90', 0, '2024-09-05 10:49:09', '0.10'),
(5, 5, '9.90', 0, '2024-09-05 10:54:22', '0.10'),
(6, 6, '9.90', 0, '2024-09-05 10:55:34', '0.10'),
(7, 7, '9.90', 0, '2024-09-05 10:58:38', '0.10'),
(8, 8, '9.90', 0, '2024-09-05 11:00:01', '0.10'),
(9, 9, '9.90', 0, '2024-09-05 11:02:56', '0.10'),
(10, 10, '9.90', 0, '2024-09-06 15:32:52', '0.00'),
(11, 11, '9.90', 0, '2024-09-05 11:05:14', '0.10'),
(12, 12, '9.90', 0, '2024-09-05 11:07:07', '0.10'),
(13, 13, '9.90', 0, '2024-09-05 11:07:58', '0.10'),
(14, 14, '9.90', 0, '2024-09-05 11:10:08', '0.10'),
(15, 15, '9.90', 0, '2024-09-05 11:11:00', '0.10'),
(16, 16, '9.90', 0, '2024-09-05 15:26:18', '0.00'),
(17, 17, '12.90', 1, '2024-09-05 15:23:22', '0.00'),
(18, 18, '10.00', 0, '2024-09-06 15:23:38', '0.00');

--
-- Triggers `person_points_summary`
--
DELIMITER $$
CREATE TRIGGER `update_rank` BEFORE UPDATE ON `person_points_summary` FOR EACH ROW BEGIN
   IF NEW.total_points <= 10 THEN
      SET NEW.rank = 0;
   ELSEIF NEW.total_points > 10 AND NEW.total_points <= 25 THEN
      SET NEW.rank = 1;
   ELSEIF NEW.total_points > 25 AND NEW.total_points <= 50 THEN
      SET NEW.rank = 2;
   ELSE
      SET NEW.rank = 3;
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
(2, 2, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 7, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 8, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 9, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 10, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 11, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 12, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 13, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 14, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 15, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 16, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 17, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 18, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `previousexperience`
--

CREATE TABLE `previousexperience` (
  `experience_id` int(10) UNSIGNED NOT NULL,
  `person_id` int(11) NOT NULL,
  `ifexperience` enum('yes','no') DEFAULT NULL,
  `companyname` varchar(255) NOT NULL,
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
(2, 2, NULL, '', NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, '', NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, '', NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, '', NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, '', NULL, NULL, NULL, NULL, NULL),
(7, 7, NULL, '', NULL, NULL, NULL, NULL, NULL),
(8, 8, NULL, '', NULL, NULL, NULL, NULL, NULL),
(9, 9, NULL, '', NULL, NULL, NULL, NULL, NULL),
(10, 10, NULL, '', NULL, NULL, NULL, NULL, NULL),
(11, 11, NULL, '', NULL, NULL, NULL, NULL, NULL),
(12, 12, NULL, '', NULL, NULL, NULL, NULL, NULL),
(13, 13, NULL, '', NULL, NULL, NULL, NULL, NULL),
(14, 14, NULL, '', NULL, NULL, NULL, NULL, NULL),
(15, 15, NULL, '', NULL, NULL, NULL, NULL, NULL),
(16, 16, NULL, '', NULL, NULL, NULL, NULL, NULL),
(17, 17, NULL, '', NULL, NULL, NULL, NULL, NULL),
(18, 18, NULL, '', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_table`
--

CREATE TABLE `role_table` (
  `id` int(11) NOT NULL,
  `role_column` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role_table`
--

INSERT INTO `role_table` (`id`, `role_column`, `status`) VALUES
(1, 'Manager', 1),
(2, 'Assistant Manager', 1),
(3, 'HR', 0),
(4, 'Executive Manager', 0),
(5, 'Designer', 0),
(9, 'Assistant Vice President', 1),
(10, 'Managing Director ', 1);

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
-- Dumping data for table `skillset_table`
--

INSERT INTO `skillset_table` (`id`, `skillset_column`, `status`) VALUES
(1, 'Front-end', 0),
(2, 'Backend', 0),
(3, 'Full-stack', 1),
(4, 'UI/UX', 0),
(5, 'Mobile App Development', 1),
(6, 'cybersecurity', 0);

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
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`incident_id`);

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
  MODIFY `alumni_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `company_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `company_table`
--
ALTER TABLE `company_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `consultancy`
--
ALTER TABLE `consultancy`
  MODIFY `consultancy_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `domain_table`
--
ALTER TABLE `domain_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expertise`
--
ALTER TABLE `expertise`
  MODIFY `expertise_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `incident_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `internship`
--
ALTER TABLE `internship`
  MODIFY `internship_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  MODIFY `outcome_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `personalinfo`
--
ALTER TABLE `personalinfo`
  MODIFY `person_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `person_points_summary`
--
ALTER TABLE `person_points_summary`
  MODIFY `summary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `placement`
--
ALTER TABLE `placement`
  MODIFY `placement_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `previousexperience`
--
ALTER TABLE `previousexperience`
  MODIFY `experience_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `role_table`
--
ALTER TABLE `role_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `skillset_table`
--
ALTER TABLE `skillset_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
