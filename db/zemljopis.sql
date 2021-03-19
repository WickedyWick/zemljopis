-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2021 at 10:38 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zemljopis`
--

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `dataID` int(11) NOT NULL,
  `roundID` int(11) DEFAULT NULL,
  `playerID` int(11) DEFAULT NULL,
  `drzava` varchar(80) COLLATE utf8_croatian_ci DEFAULT NULL,
  `grad` varchar(80) COLLATE utf8_croatian_ci DEFAULT NULL,
  `ime` varchar(80) COLLATE utf8_croatian_ci DEFAULT NULL,
  `biljka` varchar(120) COLLATE utf8_croatian_ci DEFAULT NULL,
  `zivotinja` varchar(120) COLLATE utf8_croatian_ci DEFAULT NULL,
  `planina` varchar(120) COLLATE utf8_croatian_ci DEFAULT NULL,
  `reka` varchar(120) COLLATE utf8_croatian_ci DEFAULT NULL,
  `predmet` varchar(240) COLLATE utf8_croatian_ci DEFAULT NULL,
  `bodovi` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_croatian_ci;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`dataID`, `roundID`, `playerID`, `drzava`, `grad`, `ime`, `biljka`, `zivotinja`, `planina`, `reka`, `predmet`, `bodovi`) VALUES
(1, 1, 1, 'sadas', 'dasdas', 'dasda', 'dasdas', 'dasd', 'asdas', 'd', 'asdsd', 0),
(2, 2, 2, 'sda', 'dsada', 'asdasdasdas', 'asdas', 'asdasd', 'asdas', 'dasdas', 'asdas', 0);

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `playerID` int(11) NOT NULL,
  `roomCode` varchar(8) COLLATE utf8_croatian_ci DEFAULT NULL,
  `username` varchar(30) COLLATE utf8_croatian_ci DEFAULT NULL,
  `sessionToken` varchar(48) COLLATE utf8_croatian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_croatian_ci;

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`playerID`, `roomCode`, `username`, `sessionToken`) VALUES
(1, 'lEIbVMDi', 'MasterWick', 'vnI0qGJrHUS8qFqyhuvV9SZiiT0NTDfhAQKrK2njajNE5Sxa'),
(2, 'IKcm1ICX', 'MasterWick', 'qVW4nI+Pr73xx7os5DzsZzKqSCF1IJkTd540fiyp5N6YCNVH');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `roomID` int(11) NOT NULL,
  `roomCode` varchar(8) COLLATE utf8_croatian_ci DEFAULT NULL,
  `playerNumber` int(2) DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `active` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_croatian_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`roomID`, `roomCode`, `playerNumber`, `dateCreated`, `active`) VALUES
(1, 'lEIbVMDi', 1, '2021-03-08 18:36:56', 0),
(2, 'IKcm1ICX', 1, '2021-03-09 12:00:15', 0);

-- --------------------------------------------------------

--
-- Table structure for table `round`
--

CREATE TABLE `round` (
  `roundID` int(11) NOT NULL,
  `roundNumber` int(2) DEFAULT NULL,
  `roomCode` varchar(8) COLLATE utf8_croatian_ci DEFAULT NULL,
  `slovo` varchar(2) COLLATE utf8_croatian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_croatian_ci;

--
-- Dumping data for table `round`
--

INSERT INTO `round` (`roundID`, `roundNumber`, `roomCode`, `slovo`) VALUES
(1, 1, 'lEIbVMDi', 'đ'),
(2, 1, 'IKcm1ICX', 't'),
(3, 2, 'IKcm1ICX', 'lj');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`dataID`),
  ADD KEY `roundID` (`roundID`),
  ADD KEY `playerID` (`playerID`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`playerID`),
  ADD KEY `roomCode` (`roomCode`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`roomID`),
  ADD UNIQUE KEY `roomCode` (`roomCode`);

--
-- Indexes for table `round`
--
ALTER TABLE `round`
  ADD PRIMARY KEY (`roundID`),
  ADD KEY `roomCode` (`roomCode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `dataID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `player`
--
ALTER TABLE `player`
  MODIFY `playerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `roomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `round`
--
ALTER TABLE `round`
  MODIFY `roundID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `data_ibfk_1` FOREIGN KEY (`roundID`) REFERENCES `round` (`roundID`),
  ADD CONSTRAINT `data_ibfk_2` FOREIGN KEY (`playerID`) REFERENCES `player` (`playerID`);

--
-- Constraints for table `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`roomCode`) REFERENCES `room` (`roomCode`);

--
-- Constraints for table `round`
--
ALTER TABLE `round`
  ADD CONSTRAINT `round_ibfk_1` FOREIGN KEY (`roomCode`) REFERENCES `room` (`roomCode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
