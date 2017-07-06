-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 06 jul 2017 kl 20:15
-- Serverversion: 10.1.22-MariaDB
-- PHP-version: 7.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `hexclone_db`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `account`
--

CREATE TABLE `account` (
  `UID` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `reputation` int(11) NOT NULL DEFAULT '0',
  `serverID` int(11) NOT NULL,
  `tasks` int(11) NOT NULL,
  `email` text NOT NULL,
  `confirmation_code` text NOT NULL,
  `access_level` int(11) NOT NULL DEFAULT '0',
  `collected` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `account_information`
--

CREATE TABLE `account_information` (
  `userID` int(11) NOT NULL,
  `last_collected_worked` text NOT NULL,
  `last_collected_generated` text NOT NULL,
  `last_collected_acc` text NOT NULL,
  `last_collected_bonus` float NOT NULL,
  `last_collected_ip` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `active_virus`
--

CREATE TABLE `active_virus` (
  `ID` int(11) NOT NULL,
  `virusID` int(11) NOT NULL COMMENT 'softwareID',
  `started` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'DATE',
  `collected` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'DATE',
  `serverID` int(11) NOT NULL,
  `ownerID` int(11) NOT NULL,
  `version` float NOT NULL,
  `type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `bank_account`
--

CREATE TABLE `bank_account` (
  `ID` int(11) NOT NULL,
  `addr` text NOT NULL,
  `ip` text NOT NULL,
  `money` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `bitcoin`
--

CREATE TABLE `bitcoin` (
  `userID` int(11) NOT NULL,
  `btc_addr` text NOT NULL,
  `btc_key` text NOT NULL,
  `value` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `hackedlist`
--

CREATE TABLE `hackedlist` (
  `id` int(11) NOT NULL,
  `ip` text NOT NULL,
  `uid` int(11) NOT NULL,
  `pass` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `hardware_server`
--

CREATE TABLE `hardware_server` (
  `id` int(11) NOT NULL,
  `cpu_id` int(11) NOT NULL DEFAULT '1',
  `ram_id` int(11) NOT NULL DEFAULT '1',
  `hdd_id` int(11) NOT NULL DEFAULT '1',
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `hardware_server`
--

INSERT INTO `hardware_server` (`id`, `cpu_id`, `ram_id`, `hdd_id`, `uid`) VALUES
(819, 8, 1, 5, 0),
(840, 8, 1, 5, 0);

-- --------------------------------------------------------

--
-- Tabellstruktur `mail`
--

CREATE TABLE `mail` (
  `ID` int(11) NOT NULL,
  `title` text NOT NULL,
  `message` text NOT NULL,
  `fromID` text NOT NULL,
  `toID` int(11) NOT NULL,
  `seen` int(11) NOT NULL DEFAULT '0',
  `sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `online`
--

CREATE TABLE `online` (
  `session` varchar(100) NOT NULL,
  `time` int(11) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `process`
--

CREATE TABLE `process` (
  `pid` int(11) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `title` text NOT NULL,
  `action` text NOT NULL,
  `data_ip` text NOT NULL,
  `data_id` int(11) NOT NULL,
  `redirect` text NOT NULL,
  `userID` int(11) NOT NULL,
  `data_tag` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `server`
--

CREATE TABLE `server` (
  `ID` int(11) NOT NULL,
  `name` text NOT NULL,
  `extra` text NOT NULL,
  `ip` text NOT NULL,
  `net_id` int(11) NOT NULL DEFAULT '1',
  `user` text NOT NULL,
  `pass` text NOT NULL,
  `type` text NOT NULL,
  `log_data` text NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `server`
--

INSERT INTO `server` (`ID`, `name`, `extra`, `ip`, `net_id`, `user`, `pass`, `type`, `log_data`, `text`) VALUES
(337, 'First Whois', 'Whois', '1.2.3.4', 6, 'root', 'zGyd5k2R', 'npc_important', '2017-06-17 05:37 - [50.199.69.122] logged in as root\r\n', 'Welcome to the First Whois server. Enjoy our services!<ul class=\"whois\"><li><a href=\"internet?ip=241.151.9.102\"><span class=\"item\">241.151.9.102</span> - <span class=\"whois-member\">Download Center</span></a></li><li><a href=\"internet?ip=17.214.45.165\"><span class=\"item\">17.214.45.165</span> - <span class=\"whois-member\">Torrent Market</span></a></li><li><a href=\"internet?ip=206.128.223.106\"><span class=\"item\">206.128.223.106</span> - <span class=\"whois-member\">First Puzzle</span></a></li><li><a href=\"internet?ip=206.211.30.54\"><span class=\"item\">206.211.30.54</span> - <span class=\"whois-member\">First International Bank</span></a></li><li><a href=\"internet?ip=146.60.14.112\"><span class=\"item\">146.60.14.112</span> - <span class=\"whois-member\">elgooG</span></a></li><li><a href=\"internet?ip=110.15.172.26\"><span class=\"item\">110.15.172.26</span> - <span class=\"whois-member\">Murder King</span></a></li><li><a href=\"internet?ip=234.56.132.167\"><span class=\"item\">234.56.132.167</span> - <span class=\"whois-member\">Safenet</span></a></li><li><a href=\"internet?ip=232.79.77.77\"><span class=\"item\">232.79.77.77</span> - <span class=\"whois-member\">Pineapple</span></a></li></ul>Trending Sites:<ul class=\"whois\"><li><a href=\"internet?ip=160.7.191.179\"><span class=\"item\">160.7.191.179</span> - <span class=\"whois-member\">Bitcoin Market</span></a></li><li><a href=\"internet?ip=1.158.201.174\"><span class=\"item\">1.158.201.174</span> - <span class=\"whois-member\">ISP - Internet Service Provider</span></a></li><li><a href=\"internet?ip=9.149.137.9\"><span class=\"item\">9.149.137.9</span> - <span class=\"whois-member\">NSA</span></a></li><li><a href=\"internet?ip=4.2.178.10\"><span class=\"item\">4.2.178.10</span> - <span class=\"whois-member\">Hacker News</span></a></li></ul>'),
(338, 'Capitalism', 'NPC', '107.56.87.143', 6, 'root', 'mvp3mucX', 'npc', '2017-06-17 05:39 - [50.199.69.122] logged in as root\r\n', '<div class=\"center\"><img alt=\"Capitalism\" title=\"Capitalism\" src=\"images/npc/capitalism.png\"><br><br></div>'),
(339, 'Murder King', 'NPC', '110.15.172.26', 6, 'root', 'KsYUYuHa', 'npc', '', '<div class=\"center\"><img alt=\"Murder King\" title=\"Murder King\" src=\"images/npc/murderking.jpg\"><br><br><span class=\"small\">Youll get it our way.</span></div>'),
(340, 'Abersnobby &amp; Bitch', 'NPC', '110.251.195.226', 6, 'root', 'bnz6yIOU', 'npc', '', '<div class=\"center\"><img alt=\"Abersnobby &amp; Bitch\" title=\"Abersnobby &amp; Bitch\" src=\"images/npc/abersnobby.jpg\"><br><br></div>'),
(341, 'Too Many Secrets', 'NPC', '116.70.198.182', 6, 'root', 'BTuyPc31', 'npc', '', '<div class=\"center\"><img src=\"images/npc/toomanysecrets.JPG\"></div>'),
(342, 'Microlost', 'NPC', '134.43.8.219', 6, 'root', '7mQViglh', 'npc', '2017-06-17 05:37 - [50.199.69.122] logged in as root\r\n', '<div class=\"center\"><img alt=\"Microlost\" title=\"Microlost\" src=\"images/npc/microlost.jpg\"><br><br>Will work for a while.</div>'),
(343, 'Titanic', 'NPC', '136.148.123.51', 6, 'root', 'YzDdsTIJ', 'npc', '', '<div class=\"center\"><img alt=\"Titanic\" title=\"Titanic\" src=\"images/npc/titanic.jpg\"><br><br></div>'),
(344, 'Lorem ipsum', 'NPC', '136.204.64.26', 6, 'root', 'o0A2SB1i', 'npc', '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod luctus lorem eu bibendum. Suspendisse eget nislNullam at mollis risus. Vivamus rhoncus pretium neque eu convallis. Nullam rhoncus gravida purus, non gravida tortorVivamus dapibus diam ut libero consectetur semper. Fusce pellentesque arcu nec iaculis suscipit. Sed eget nisi eget mauris sodales cursus sed non magna. Fusce porta nibh id lectus venenatis, id tempus felis lobortis. Quisque vel eleifend diam. Sed consequat feugiat nisl quis tempor. Nulla in orci at magna tempus euismod non id nunc. Maecenas vel malesuada nisi. Donec sed lacus eleifend, sollicitudin ipsum eu, vulputate libero. Donec bibendum tellus non faucibus sagittis. Mauris tincidunt vulputate mattis.In vel neque non felis convallis euismod non quis est. Quisque velit velit, posuere in turpis vel, varius sollicitudin nibh. Morbi ultrices hackris expiriencis amet nunc viverra varius. Donec ut quam libero. Etiam facilisis enim eu massa faucibus ullamcorper. Donec sollicitudin erat et porttitor porta. Integer sit amet viverra nisi. Integer vitae augue vestibulum, elementum justo in, luctus orci. Integer sit amet turpis luctus, commodo massa eu, malesuada quam. Donec feugiat, tortor in molestie ornare, mi mi viverra mauris, id pharetra purus augue ac sem.'),
(345, 'American Expense', 'Bank', '145.120.155.3', 6, 'root', 'L1MrEyAj', 'npc_important', '', '<div class=\"center\">Welcome to <strong>American Expense</strong>.<br><a href=\"internet?action=login&amp;type=bank\">Login</a><br><br><img src=\"images/npc/american-expense.jpg\"></div>'),
(346, 'elgooG', 'NPC', '146.60.14.112', 6, 'root', '15CVKNJh', 'npc', '', '<div class=\"center\"><img alt=\"elgooG\" title=\"elgooG\" src=\"images/npc/elgoog.png\"><br><strong>Dont be evil.</strong><br><span class=\"small\">unless it is profitable.</span></div>'),
(347, 'Fail', 'NPC', '159.144.199.181', 6, 'root', 'UhChz91L', 'npc', '', '<div class=\"center\"><img alt=\"Fail\" title=\"Fail\" src=\"images/npc/fail.jpg\"><br><br></div>'),
(348, 'Second Whois', 'Whois', '164.50.56.166', 6, 'root', 'zuFWsKka', 'npc_important', '2017-06-17 05:40 - [50.199.69.122] logged in as root\r\n', 'Second Whois, INC.<ul class=\"whois\"><li><a href=\"internet?ip=17.69.155.119\"><span class=\"item\">17.69.155.119</span> - <span class=\"whois-member\">HEBC</span></a></li><li><a href=\"internet?ip=136.204.64.26\"><span class=\"item\">136.204.64.26</span> - <span class=\"whois-member\">Lorem Ipsum</span></a></li><li><a href=\"internet?ip=145.120.155.3\"><span class=\"item\">145.120.155.3</span> - <span class=\"whois-member\">American Expense</span></a></li><li><a href=\"internet?ip=246.73.218.218\"><span class=\"item\">246.73.218.218</span> - <span class=\"whois-member\">Hangman</span></a></li><li><a href=\"internet?ip=116.70.198.182\"><span class=\"item\">116.70.198.182</span> - <span class=\"whois-member\">Too Many Secrets</span></a></li><li><a href=\"internet?ip=64.152.124.105\"><span class=\"item\">64.152.124.105</span> - <span class=\"whois-member\">Hacker Inside</span></a></li><li><a href=\"internet?ip=59.14.53.70\"><span class=\"item\">59.14.53.70</span> - <span class=\"whois-member\">Lifes Though</span></a></li><li><a href=\"internet?ip=50.195.250.20\"><span class=\"item\">50.195.250.20</span> - <span class=\"whois-member\">McDiabetes</span></a></li></ul>'),
(349, 'Torrent Market', 'NPC', '17.214.45.165', 6, 'root', 'cF8IWVRM', 'npc', '', 'F.L.I.E.N.D.S (1.0) - <span class=\"green\">$0.1</span><span class=\"small nomargin\"> / GB</span><br>Fotoshop CS6 (3.0) - <span class=\"green\">$0.3</span><span class=\"small nomargin\"> / GB</span>'),
(350, 'HEBC', 'Bank', '17.69.155.119', 6, 'root', 'vgWFaZIO', 'npc_important', '2017-06-17 05:41 - [50.199.69.122] logged in as root\r\n', '<div class=\"center\">Welcome to <strong>HEBC</strong>.<br><a href=\"internet?action=login&amp;type=bank\">Login</a><br><br><img src=\"images/npc/hebc.jpg\"></div>'),
(351, 'Oops', 'NPC', '182.22.222.202', 6, 'root', 'goLCXqPE', 'npc', '', '<div class=\"center\"><img alt=\"Oops\" title=\"Oops\" src=\"images/npc/oops.jpg\"><br><br><span class=\"small\">Consider it gone.</span></div>'),
(352, 'WTF', 'NPC', '202.143.229.186', 6, 'root', 'MclfHbUS', 'npc', '', '<div class=\"center\"><img alt=\"WTF\" title=\"WTF\" src=\"images/npc/wtf.jpg\"><br><br></div>'),
(353, 'First Puzzle', 'NPC', '206.128.223.106', 6, 'root', 'Gp7RAwkx', 'npc', '2017-06-17 05:34 - [50.199.69.122] installed file Basic Spam.vspam (1.0)\r\n2017-06-17 05:34 - [50.199.69.122] logged in as root\r\n2017-06-17 05:07 - [50.199.69.122] installed file Basic Spam.vspam (1.0)\r\n2017-06-17 05:07 - [50.199.69.122] logged in as root\r\n', 'Welcome to the First Puzzle. Follow the trail to get better softwares.<br><br>The First Puzzle is easy, but can you solve the next ones? Good luck :)'),
(354, 'First International Bank', 'Bank', '206.211.30.54', 6, 'root', 'TWyUcCQT', 'npc_important', '', 'Welcome to the <strong>First International Bank</strong>.<br><br>We have a very modest defense, but at least you didnt have to pay for an account.<br><br><a href=\"internet?action=login&amp;type=bank\">Login to your account</a>.'),
(355, 'FBI', 'Important', '210.117.143.141', 6, 'root', 'l2PgxtKn', 'npc', '', '<a href=\"internet?ip=82.197.123.88\">82.197.123.88</a> - <b>Bounty:</b> <font color=\"green\">$500,000</font> - <b>Reason:</b> DDoS<br> '),
(356, 'Broke', 'NPC', '213.0.251.157', 6, 'root', '5WI97X2a', 'npc', '', '<div class=\"center\"><img alt=\"Broke\" title=\"Broke\" src=\"images/npc/xbroke.gif\"><br><br></div>'),
(357, 'Weird', 'NPC', '222.61.160.100', 6, 'root', 'XGzkMvDv', 'npc', '', '<div class=\"center\"><img alt=\"Weird\" title=\"Weird\" src=\"images/npc/weird.gif\"><br><br></div>'),
(358, 'Yahoo?', 'NPC', '223.169.22.237', 6, 'root', 'vjrkMyFq', 'npc', '', '<div class=\"center\"><img alt=\"Yahoo?\" title=\"Yahoo?\" src=\"images/npc/yahoo.jpg\"><br><br></div>'),
(359, 'Swiss International Bank', 'Bank', '227.238.225.94', 6, 'root', 'ItqTu62u', 'npc_important', '2017-06-17 05:38 - [50.199.69.122] logged in as root\r\n', '<div class=\"center\">Welcome to <strong>Swiss International Bank</strong>.<br><a href=\"internet?action=login&amp;type=bank\">Offshore account login</a><br><br><img src=\"images/npc/swiss.svg\"></div>'),
(360, 'Pineapple', 'NPC', '232.79.77.77', 6, 'root', 'D5owMUMr', 'npc', '', '<div class=\"center\"><img alt=\"Pineapple\" title=\"Pineapple\" src=\"images/npc/pineapple.png\"><br><br>Appearence Costs <sup>®</sup></div><p></p>'),
(361, 'Safenet', 'Important', '234.56.132.167', 6, 'root', 'EBj2rzjl', 'npc_important', '', '8.211.XXX.XX - reason: DDoS<br>'),
(362, 'Puzzle', 'NPC', '235.105.159.122', 6, 'root', '9CUL7uaU', 'npc', '', '<p><iframe id=\"jodiframe\" src=\"http://wwwwwwwww.jodi.org/\" width=\"100%\" height=\"500px\" seamless=\"1\"></iframe></p>'),
(363, 'Stalker', 'NPC', '239.72.245.117', 6, 'root', 'xcqrsZkC', 'npc', '', '<div class=\"center\"><img alt=\"Stalker\" title=\"Stalker\" src=\"images/npc/stalker.jpg\"><br><br><span class=\"small\">Wasting peoples lives since 2004.</span></div>'),
(364, 'Download Center', 'NPC', '241.151.9.102', 6, 'download', 'download', 'npc_download', '2017-06-17 05:33 - [50.199.69.122] logged in as root\r\n2017-06-17 04:58 - [50.199.69.122] logged in as root\r\n2017-06-17 04:56 - [50.199.69.122] logged in as root\r\n2017-06-17 04:56 - [50.199.69.122] logged in as root\r\n', 'Welcome to the download center! <br><br> Download whatever you need. Unlimited bandwidth! <br><br> <strong>Username:</strong> download<br><strong>Password:</strong> download'),
(365, 'Hangman', 'NPC', '246.73.218.218', 6, 'root', 'uCVJKAg7', 'npc', '', '<style>#Hangman{border:1px #000 solid;height:120px}</style><div style=\"font:bold 12pt ;color:#000000\">Hangman</div><div style=\"font:normal 8pt ;color:#000000\">provided by <a style=\"color:#000000\" href=\"http://www.thefreedictionary.com/\">TheFreeDictionary</a></div></div>'),
(366, 'Yuhack', 'NPC', '250.33.59.2', 6, 'root', '4dUQIhXC', 'npc', '', '<div class=\"center\"><img src=\"images/npc/yuhack.jpg\"></div>'),
(367, 'HackerNews', 'NPC', '4.2.178.10', 6, 'root', 'hS9smDIJ', 'npc', '', '<iframe src=\"http://ihackernews.com/\" width=\"100%\" height=\"500\" seamless=\"\"></iframe><br><br> Disclaimer: (<a href=\"http://ihackernews.com/\">i</a>)<a href=\"https://news.ycombinator.com/\">HackerNews</a> is not related to Hacker Experience in any way.'),
(368, 'Sexsi', 'NPC', '43.20.109.242', 6, 'root', 'mtP54YlJ', 'npc', '', '<div class=\"center\"><img alt=\"Sexsi\" title=\"Sexsi\" src=\"images/npc/sexsi.jpg\"><br><br><span class=\"small\">When there is no coke.</span></div>'),
(369, 'Hell Computers', 'NPC', '43.29.81.199', 6, 'root', 'XsM15XTr', 'npc', '', '<div class=\"center\"><img alt=\"Hell Computers\" title=\"Hell Computers\" src=\"images/npc/hell.jpg\"><br><br></div>'),
(370, 'Toshibe', 'NPC', '49.251.146.246', 6, 'root', 'i2PIA6n9', 'npc', '', '<div class=\"center\"><img alt=\"Toshibe\" title=\"Toshibe\" src=\"images/npc/toshibe.png\"><br><br></div>'),
(371, 'McDiabetes', 'NPC', '50.195.250.20', 6, 'root', 'FbrmEdCK', 'npc', '', '<div class=\"center\"><img alt=\"McDiabetes\" title=\"McDiabetes\" src=\"images/npc/mcdiabetes.jpg\"><br><br></div>'),
(372, 'Life\'s tough', 'NPC', '59.14.53.70', 6, 'root', 'IRG0Vw3G', 'npc', '', '<div class=\"center\"><img alt=\"Life\'s tough\" title=\"Life\'s tough\" src=\"images/npc/lifestough.jpg\"><br><br></div>'),
(373, 'Sunk', 'NPC', '59.219.123.126', 6, 'root', 'Q4XPd0hB', 'npc', '', '<div class=\"center\"><img alt=\"Sunk\" title=\"Sunk\" src=\"images/npc/sunk.jpg\"><br><br></div>'),
(374, 'Hacker Inside', 'NPC', '64.152.124.105', 6, 'root', 'omcXbtnl', 'npc', '2017-06-17 05:41 - [50.199.69.122] logged in as root\r\n', '<div class=\"center\"><img alt=\"Hacker Inside\" title=\"Hacker Inside\" src=\"images/npc/hackerinside.svg\"><br><br><span class=\"small\">Lammer outside</span></div>'),
(375, 'Pervert', 'NPC', '71.99.216.115', 6, 'root', 'ich1174Q', 'npc', '', '<div class=\"center\"><img alt=\"Pervert\" title=\"Pervert\" src=\"images/npc/pervert.jpg\"><br><br></div>'),
(376, 'Nuke', 'NPC', '82.1.139.6', 6, 'root', 'Y7lr6jjl', 'npc', '', '<div class=\"center\"><img alt=\"Nuke\" title=\"Nuke\" src=\"images/npc/nuke.png\" style=\"background-color: #000;\"><br><br></div>'),
(377, 'NSA', 'Important', '9.149.137.9', 6, 'root', 'oTpSS0hZ', 'npc_important', '2017-06-17 05:48 - [50.199.69.122] logged in as root\r\n', '<div class=\"center\"><img src=\"img/nsa.png\"></div>'),
(378, 'Ultimate Bank', 'Bank', '92.248.30.241', 6, 'root', '5QQBghMl', 'npc_important', '', 'Welcome to the <strong>Ultimate Bank</strong>.<br><br>Safety matters! You wont find a safer bank.<br><br><a href=\"internet?action=login&amp;type=bank\">Login now</a>'),
(379, 'Nothing to do', 'NPC', '98.210.15.134', 6, 'root', 'ejazpIsR', 'npc', '', '<div class=\"center\"><img alt=\"Nothing to do\" title=\"Nothing to do\" src=\"images/npc/nothingtodo.jpg\"><br><br></div>'),
(380, 'ISP - Internet Service Provider', 'ISP', '1.158.201.174', 10, 'root', 'WfucbeFh', 'npc_important', '', 'HEX Internet Service Provider - ISP<br><br>You can reset your IP <b>for free</b>!<br><br>If you are launching a doom attack, <strong>reseting your IP will abort the doom virus</strong>! <br><br>\r\n<form action=\"resetIP\" method=\"POST\">\r\n<input class=\"btn btn-success\" type=\"submit\" value=\"Reset free \">\r\n</form>'),
(381, 'Third Whois', 'Whois', '17.241.170.164', 6, 'root', 'zGyd5k2R', 'npc_important', '', 'Welcome to the Third Whois server. <br>\r\nWhat are you doing here?!<br>\r\nYou shouldn\'t be able too find me!!<br>');

-- --------------------------------------------------------

--
-- Tabellstruktur `software`
--

CREATE TABLE `software` (
  `ID` int(11) NOT NULL,
  `serverID` int(11) NOT NULL,
  `fullname` text NOT NULL,
  `version` float NOT NULL DEFAULT '1',
  `size` float NOT NULL DEFAULT '0',
  `type` text NOT NULL,
  `installed` int(11) NOT NULL DEFAULT '0',
  `special` text NOT NULL,
  `checksum` text NOT NULL,
  `hidden` float NOT NULL,
  `sort` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `software`
--

INSERT INTO `software` (`ID`, `serverID`, `fullname`, `version`, `size`, `type`, `installed`, `special`, `checksum`, `hidden`, `sort`) VALUES
(393, 337, 'Decent Cracker.crc', 2.1, 83, 'Cracker', 1, '', '6baf28d42061f7d6d24fa247ee76bee8', 0, 1),
(394, 337, 'Decent Hasher.hash', 2, 69, 'Hasher', 1, '', 'bbf09210a6a7e2e6cf75952f45e47ec0', 0, 2),
(395, 337, 'Decent Firewall.fwl', 2, 63, 'Firewall', 1, '', 'e5c90d667a0632f96aa759ca35fcb1c2', 0, 4),
(396, 337, 'Decent Hidder.hdr', 2, 45, 'Hidder', 0, '', '0f8764b5fa593f349228ef0890e06507', 0, 5),
(397, 337, 'Generic Seeker.skr', 1.9, 41, 'Seeker', 0, '', 'f115f1be89b95a60fa3701e1421051c6', 0, 6),
(398, 337, 'Decent Anti-Virus.av', 2, 48, 'Antivirus', 0, 'av', 'fabb67a66eaf8ca8d6ecb60d179db2ab', 0, 7),
(399, 337, 'Decent Spam.vspam', 2, 36, 'Spam virus', 0, 'virus', '181664df49d33cf1763d501f49360a39', 0, 8),
(400, 337, 'Decent Warez.vwarez', 2, 36, 'WareZ virus', 0, 'virus', '85b6026ece59ad3864cad728cb7acdf5', 0, 8),
(401, 337, 'Generic FTP Exploit.exp', 1.8, 47, 'FTP Exploit', 0, '', '09c775d1f14a7c102569d2d7a013cf0f', 0, 11),
(402, 337, 'Decent SSH Exploit.exp', 2, 57, 'SSH Exploit', 0, '', '80b36def1c7d7271fb6fbc64424957a6', 0, 12),
(403, 337, 'Basic Analyzer.ana', 1, 23, 'Analyzer', 0, 'analy', 'e60a61bfb9e3b241bb05b7b3b697e354', 0, 14),
(404, 337, 'Winblows 8.1.torrent', 2, 63, 'Torrent', 0, 'torrent', '10b9553e66de6d28d391365800c8d73c', 0, 14),
(405, 337, 'Webserver.exe', 1, 100, 'Web server', 0, 'web', 'caa9a522b27bd3a218c69a3f4ff03ec9', 0, 14),
(406, 337, 'Decent Miner.vminer', 2, 63, 'Bitcoin Miner', 0, 'virus', 'cdd33067e36a363a033c93d6e2c4f9e5', 0, 15),
(407, 338, 'Decent Cracker.crc', 2.5, 116, 'Cracker', 1, '', '28422cc1b5e9d5deeb546059c4437c33', 0, 1),
(408, 338, 'Decent Hasher.hash', 2.7, 125, 'Hasher', 1, '', '97741cd88897a2c35d505e9075d9d93d', 0, 2),
(409, 338, 'Decent Firewall.fwl', 2.2, 76, 'Firewall', 1, '', '1e2daf25465657e3e28b253ad175350f', 0, 4),
(410, 338, 'Decent Warez.vwarez', 2, 36, 'WareZ virus', 0, 'virus', '85b6026ece59ad3864cad728cb7acdf5', 0, 8),
(411, 338, 'Decent FTP Exploit.exp', 2.5, 89, 'FTP Exploit', 0, '', '5e3d00ea36b98091e94f6d3f18da4ff6', 0, 11),
(412, 339, 'Basic Cracker.crc', 1.3, 37, 'Cracker', 1, '', '028ad5f9a20ca121f275289572d967b1', 0, 1),
(413, 339, 'Basic Hasher.hash', 1.1, 28, 'Hasher', 1, '', 'c64806bd0d5ed31e5a3c2818cc068b1d', 0, 2),
(414, 339, 'Basic Firewall.fwl', 1.2, 28, 'Firewall', 1, '', '444ec2ae30bdd3cc532865768f546472', 0, 4),
(415, 339, 'Basic Hidder.hdr', 1.4, 25, 'Hidder', 0, '', '5e4c53fa0eab0ec3a8625c165c8f41d4', 0, 5),
(416, 339, 'Basic Seeker.skr', 1.2, 20, 'Seeker', 0, '', '945fbcf6fb8d700586e283bb73160cd0', 0, 6),
(417, 339, 'Basic Spam.vspam', 1.2, 16, 'Spam virus', 0, 'virus', '0c5f469d4fb17c47e97f5b41994a5b98', 0, 8),
(418, 339, 'Basic FTP Exploit.exp', 1.1, 23, 'FTP Exploit', 0, '', '2e6ac5f86d57d980161f52057e611a16', 0, 11),
(419, 341, 'Decent Cracker.crc', 2.2, 90, 'Cracker', 1, '', 'd2013f03a669ffb5494e1f6b2c00cd96', 0, 1),
(420, 341, 'Decent Hasher.hash', 2.1, 76, 'Hasher', 1, '', '2e41a5027b6ae66d2c201aa34e8b1747', 0, 2),
(421, 341, 'Decent Firewall.fwl', 2, 63, 'Firewall', 1, '', 'e5c90d667a0632f96aa759ca35fcb1c2', 0, 4),
(422, 341, 'Generic Hidder.hdr', 1.8, 38, 'Hidder', 0, '', 'a5849f5af650a14c7badab2841088876', 0, 5),
(423, 341, 'Decent DDoS.vddos', 2, 39, 'DDoS virus', 0, 'virus', '745926f7827ae8cd4ba618a222a69bf6', 0, 9),
(424, 341, 'Decent FTP Exploit.exp', 2.6, 96, 'FTP Exploit', 0, '', '9d2c3eabbced43d3e10470369cc04a47', 0, 11),
(425, 341, 'Generic SSH Exploit.exp', 1.9, 52, 'SSH Exploit', 0, '', '4b541ce587bb415965960de136bff807', 0, 12),
(426, 342, 'Basic Cracker.crc', 1.1, 30, 'Cracker', 1, '', '81078001ffa79cba06797852ac984a33', 0, 1),
(427, 342, 'Basic Hasher.hash', 1.2, 31, 'Hasher', 1, '', '3cf63ffab9e4cd9bb5775b5255cfe1dd', 0, 2),
(428, 342, 'Basic Port Scan.scan', 1, 23, 'Port Scan', 0, 'scan', 'b53ef3122382e8143f3f956d3ccd552d', 0, 3),
(429, 342, 'Basic Firewall.fwl', 1, 23, 'Firewall', 1, '', '25b37baba34bcba2133c66c2f349eb12', 0, 4),
(430, 342, 'Decent Spam.vspam', 2, 36, 'Spam virus', 0, 'virus', '181664df49d33cf1763d501f49360a39', 0, 8),
(431, 342, 'Basic Warez.vwarez', 1, 14, 'WareZ virus', 0, 'virus', 'e797280fbbf33de2b24d4e39ca4ed91b', 0, 8),
(432, 342, 'Basic FTP Exploit.exp', 1.2, 26, 'FTP Exploit', 0, '', '7cb26b4baf83fa75426680599a7ec3c8', 0, 11),
(433, 342, 'Basic SSH Exploit.exp', 1.3, 28, 'SSH Exploit', 0, '', 'c416a994a0e23de0fcef705a1597df06', 0, 12),
(434, 344, 'Decent Cracker.crc', 2.7, 136, 'Cracker', 1, '', '66f155e3cd4488b27a50130c1162399b', 0, 1),
(435, 344, 'Decent Hasher.hash', 2.5, 107, 'Hasher', 1, '', 'c54d149ac50810df4609441b2cc4c449', 0, 2),
(436, 344, 'Decent Firewall.fwl', 2.4, 90, 'Firewall', 1, '', '9f26e1c847e2b71e3f09095e2bd66154', 0, 4),
(437, 344, 'Basic Hidder.hdr', 1, 17, 'Hidder', 0, '', '2aed5f22a24783c26574b2c75e455d09', 0, 5),
(438, 344, 'Generic Seeker.skr', 1.5, 28, 'Seeker', 0, '', 'ff772984e61acccbf43a4ad39741d5e4', 0, 6),
(439, 344, 'Decent Collector.vcol', 2.5, 65, 'Virus collector', 0, 'vcol', '90836d1e64ca01b759d794be4c5616c2', 0, 10),
(440, 344, 'Decent FTP Exploit.exp', 2.3, 75, 'FTP Exploit', 0, '', '7170eb823966db99cef97b664c427b0d', 0, 11),
(441, 344, 'Intermediate Miner.vminer', 3, 142, 'Bitcoin Miner', 0, 'virus', '2b8a0e7c36b0975e9cc87f310e9d2b21', 0, 15),
(442, 345, 'Competent Hasher.hash', 4, 283, 'Hasher', 1, '', '95bb6957248d1363ee713811d7be204c', 0, 2),
(443, 345, 'Competent Firewall.fwl', 4, 258, 'Firewall', 1, '', 'd4976a2305d2a6c04abcce5dcf6567c1', 0, 4),
(444, 346, 'Generic Cracker.crc', 1.7, 56, 'Cracker', 1, '', '465ae6cca7936108dc921726a320da66', 0, 1),
(445, 346, 'Basic Hasher.hash', 1.4, 38, 'Hasher', 1, '', '4162fe856ea21249d5df2b75a62b6ba1', 0, 2),
(446, 346, 'Basic Firewall.fwl', 1.3, 31, 'Firewall', 1, '', 'c826c760ef04cd2dff35b23f24ae490a', 0, 4),
(447, 346, 'Generic FTP Exploit.exp', 1.5, 35, 'FTP Exploit', 0, '', '99196e67c4e1869c0e8377775e6dc431', 0, 11),
(448, 346, 'Basic SSH Exploit.exp', 1.1, 23, 'SSH Exploit', 0, '', '2d310c0c0c182bd3b93d05cce9c0e4a6', 0, 12),
(449, 346, 'Generic Miner.vminer', 1.5, 39, 'Bitcoin Miner', 0, 'virus', '6c9e34022cd57fd4c8f942686ed6fb4f', 0, 15),
(450, 348, 'Advanced Cracker.crc', 5.3, 555, 'Cracker', 1, '', '9a0f093157b04e167f2e64f8f39fc16c', 0, 1),
(451, 348, 'Advanced Hasher.hash', 5, 452, 'Hasher', 1, '', '2a0c906b0306dc32f257904d06395d4a', 0, 2),
(452, 348, 'Intermediate Firewal.fwl', 3.6, 207, 'Firewall', 1, '', '2de5e8d24fb173cd30c23eb17cb2cf25', 0, 4),
(453, 348, 'Advanced Hidder.hdr', 5, 295, 'Hidder', 0, '', '6724904fd5bd10010ac92a5e921c849c', 0, 5),
(454, 348, 'Advanced Seeker.skr', 5, 295, 'Seeker', 0, '', '9fcf0c38ef3ce46211b821ee8edbafde', 0, 6),
(455, 348, 'Advanced Spam.vspam', 5, 236, 'Spam virus', 0, 'virus', 'a876506664430e834d531a5b6bb510e5', 0, 8),
(456, 348, 'Advanced Warez.vwarez', 5, 236, 'WareZ virus', 0, 'virus', 'ec53013675cb5c8f9a96d60b89dda315', 0, 8),
(457, 348, 'Decent FTP Exploit.exp', 2, 57, 'FTP Exploit', 0, '', '15b4a6799cd8605887f87f111d889ee1', 0, 11),
(458, 348, 'Competent SSH Exploi.exp', 4.5, 299, 'SSH Exploit', 0, '', 'fc24e7025a9854e9c673c347fcd974fe', 0, 12),
(459, 348, 'Basic Nmap.nmap', 1, 23, 'Nmap', 0, 'nmap', 'b4103b63f1b8cdeb2f0f1bdcebdab8e8', 0, 13),
(460, 348, 'Decent Analyzer.ana', 2, 63, 'Analyzer', 0, 'analy', '9acd0ece10c471587b5612d5a6702da2', 0, 14),
(461, 348, 'Fotoshop CS6.torrent', 3, 142, 'Torrent', 0, 'torrent', '440b463f392d4a5fa87ac71910f2b027', 0, 14),
(462, 348, 'Advanced Miner.vminer', 5, 413, 'Bitcoin Miner', 0, 'virus', '1110b088a66f379c1965ea9afc3c43ea', 0, 15),
(463, 349, 'Decent Hasher.hash', 2.5, 107, 'Hasher', 1, '', 'c54d149ac50810df4609441b2cc4c449', 0, 2),
(464, 349, 'Decent Firewall.fwl', 2.5, 98, 'Firewall', 1, '', 'f58792fcf2fb6497bb9f876144661fc9', 0, 4),
(465, 349, 'Fotoshop CS6.torrent', 3, 142, 'Torrent', 0, 'torrent', '440b463f392d4a5fa87ac71910f2b027', 0, 4),
(466, 349, 'Winblows 8.1.torrent', 2, 63, 'Torrent', 0, 'torrent', '10b9553e66de6d28d391365800c8d73c', 0, 4),
(467, 349, 'F.L.I.E.N.D.S.torrent', 1, 23, 'Torrent', 0, 'torrent', '5665a2240d6645a97730f8038a520ea6', 0, 4),
(468, 350, 'Decent Hasher.hash', 2.5, 107, 'Hasher', 1, '', 'c54d149ac50810df4609441b2cc4c449', 0, 2),
(469, 350, 'Decent Firewall.fwl', 2.5, 98, 'Firewall', 1, '', 'f58792fcf2fb6497bb9f876144661fc9', 0, 4),
(470, 351, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(471, 352, 'Decent Cracker.crc', 2.2, 90, 'Cracker', 1, '', 'd2013f03a669ffb5494e1f6b2c00cd96', 0, 1),
(472, 352, 'Generic Hasher.hash', 1.6, 47, 'Hasher', 1, '', '4f2937295e587dd7961ff61137d76b6c', 0, 2),
(473, 352, 'Basic Port Scan.scan', 1, 23, 'Port Scan', 0, 'scan', 'b53ef3122382e8143f3f956d3ccd552d', 0, 3),
(474, 352, 'Generic Firewall.fwl', 1.9, 58, 'Firewall', 1, '', '5b0284d0c3daa42b4269fcc50624218d', 0, 4),
(475, 352, 'Generic Hidder.hdr', 1.8, 38, 'Hidder', 0, '', 'a5849f5af650a14c7badab2841088876', 0, 5),
(476, 352, 'Basic Spam.vspam', 1.4, 20, 'Spam virus', 0, 'virus', 'aa407944dbf7a225e0a804168200f1e8', 0, 8),
(477, 352, 'Basic SSH Exploit.exp', 1.4, 32, 'SSH Exploit', 0, '', '62c313903de99e4345ba5ad088d07606', 0, 12),
(478, 353, 'Basic Cracker.crc', 1.1, 30, 'Cracker', 1, '', '81078001ffa79cba06797852ac984a33', 0, 1),
(479, 353, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(480, 353, 'Basic Firewall.fwl', 1, 23, 'Firewall', 1, '', '25b37baba34bcba2133c66c2f349eb12', 0, 4),
(481, 353, 'Basic Hidder.hdr', 1, 17, 'Hidder', 0, '', '2aed5f22a24783c26574b2c75e455d09', 0, 5),
(482, 353, 'Basic FTP Exploit.exp', 1, 21, 'FTP Exploit', 0, '', 'abe13cf47c53ee10c5b1759127843245', 0, 11),
(483, 354, 'Generic Hasher.hash', 1.5, 42, 'Hasher', 1, '', 'c7b9f7cc36db0964430698350b51427a', 0, 2),
(484, 354, 'Generic Firewall.fwl', 1.5, 39, 'Firewall', 1, '', '907f764a317eeb790eab43e785497b53', 0, 4),
(485, 355, 'Super Hasher.hash', 10, 1.9, 'Hasher', 1, '', '44b98aad51b7f73853463860511e7fea', 0, 2),
(486, 355, 'Big Firewall.fwl', 7.5, 966, 'Firewall', 1, '', '293d7812fc0d1a9ebced92b9213c140e', 0, 4),
(487, 357, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(488, 358, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(489, 359, 'Advanced Hasher.hash', 6, 663, 'Hasher', 1, '', 'e289d64ce1d4cf09428196e8426a0646', 0, 2),
(490, 359, 'Advanced Firewall.fwl', 6, 606, 'Firewall', 1, '', '61da637e70fa2fac08f687bb9c7a8ecc', 0, 4),
(491, 360, 'Basic Cracker.crc', 1.4, 41, 'Cracker', 1, '', '702d07811e222212729aaf17e231914f', 0, 1),
(492, 360, 'Basic Hasher.hash', 1.3, 34, 'Hasher', 1, '', 'a869bb1d589d2e6b7ad8e0ce2e0968c8', 0, 2),
(493, 360, 'Basic Port Scan.scan', 1, 23, 'Port Scan', 0, 'scan', 'b53ef3122382e8143f3f956d3ccd552d', 0, 3),
(494, 360, 'Generic Firewall.fwl', 1.7, 47, 'Firewall', 1, '', '4649c55a5b1f63cb5555f3b8345c9c18', 0, 4),
(495, 360, 'Basic Hidder.hdr', 1.1, 18, 'Hidder', 0, '', '08b1b41e63e10bc33b0db2ee90417822', 0, 5),
(496, 360, 'Basic Seeker.skr', 1.2, 20, 'Seeker', 0, '', '945fbcf6fb8d700586e283bb73160cd0', 0, 6),
(497, 360, 'Basic Spam.vspam', 1.2, 16, 'Spam virus', 0, 'virus', '0c5f469d4fb17c47e97f5b41994a5b98', 0, 8),
(498, 360, 'Basic Warez.vwarez', 1.3, 18, 'WareZ virus', 0, 'virus', '272eccf3d59f6a3053b0f973eea0cd9f', 0, 8),
(499, 360, 'Basic FTP Exploit.exp', 1.2, 26, 'FTP Exploit', 0, '', '7cb26b4baf83fa75426680599a7ec3c8', 0, 11),
(500, 361, 'Advanced Hasher.hash', 5, 452, 'Hasher', 1, '', '2a0c906b0306dc32f257904d06395d4a', 0, 2),
(501, 361, 'Intermediate Firewal.fwl', 3.5, 195, 'Firewall', 1, '', 'e3707dccc443111c6836a943b8b113b0', 0, 4),
(502, 362, 'Generic Cracker.crc', 1.8, 62, 'Cracker', 1, '', 'fa7112d20f34cf9af3fb707be50e4d30', 0, 1),
(503, 362, 'Generic Hasher.hash', 1.7, 52, 'Hasher', 1, '', '59519596bdae845073226ad30a044e48', 0, 2),
(504, 362, 'Generic Firewall.fwl', 1.6, 43, 'Firewall', 1, '', 'b68ec2d12ed234823deb9863c5281ff6', 0, 4),
(505, 362, 'Generic Hidder.hdr', 1.7, 34, 'Hidder', 0, '', 'b8512a76c5eeb7558ad9152f0103955a', 0, 5),
(506, 362, 'Basic Seeker.skr', 1.3, 23, 'Seeker', 0, '', 'ce8592724ca4880102515aaa21de647f', 0, 6),
(507, 362, 'Basic Spam.vspam', 1.4, 20, 'Spam virus', 0, 'virus', 'aa407944dbf7a225e0a804168200f1e8', 0, 8),
(508, 362, 'Generic DDoS.vddos', 1.5, 24, 'DDoS virus', 0, 'virus', 'e72b8a2411509218c3120cbbbbab9e7d', 0, 9),
(509, 362, 'Basic FTP Exploit.exp', 1, 21, 'FTP Exploit', 0, '', 'abe13cf47c53ee10c5b1759127843245', 0, 11),
(510, 362, 'Basic SSH Exploit.exp', 1.3, 28, 'SSH Exploit', 0, '', 'c416a994a0e23de0fcef705a1597df06', 0, 12),
(511, 364, 'Basic Cracker.crc', 1, 28, 'Cracker', 1, '', 'a2f96c35b26f2a14a3d7186097211eb2', 0, 1),
(512, 364, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(513, 364, 'Basic Port Scan.scan', 1, 23, 'Port Scan', 0, 'scan', 'b53ef3122382e8143f3f956d3ccd552d', 0, 3),
(514, 364, 'Basic Firewall.fwl', 1, 23, 'Firewall', 1, '', '25b37baba34bcba2133c66c2f349eb12', 0, 4),
(515, 364, 'Basic Hidder.hdr', 1, 17, 'Hidder', 0, '', '2aed5f22a24783c26574b2c75e455d09', 0, 5),
(516, 364, 'Basic Seeker.skr', 1, 17, 'Seeker', 0, '', '2f83a01e489156c43a60e6387ce13cc0', 0, 6),
(517, 364, 'Basic Spam.vspam', 1, 14, 'Spam virus', 0, 'virus', '11d2469096e43aefe97ec1be83f73f5b', 0, 8),
(518, 364, 'Basic Collector.vcol', 1, 16, 'Virus collector', 0, 'vcol', '116371ae68bd43c2690ce96192acd3d3', 0, 10),
(519, 364, 'Basic FTP Exploit.exp', 1, 21, 'FTP Exploit', 0, '', 'abe13cf47c53ee10c5b1759127843245', 0, 11),
(520, 364, 'Basic SSH Exploit.exp', 1, 21, 'SSH Exploit', 0, '', '75c7b6710dbb36dbec70d239b8c5d9b3', 0, 12),
(521, 365, 'Competent Cracker.crc', 4, 307, 'Cracker', 1, '', 'a4e873d490eb3797f843d86344263598', 0, 1),
(522, 365, 'Intermediate Hasher.hash', 3.8, 254, 'Hasher', 1, '', 'f72ce9d90feacf24dd9a81afa6a5f581', 0, 2),
(523, 365, 'Intermediate Firewal.fwl', 3, 142, 'Firewall', 1, '', '053f12895c9ef51c37a53859c3fe5ccc', 0, 4),
(524, 365, 'Intermediate Hidder.hdr', 3.7, 157, 'Hidder', 0, '', 'a4e3aa545bf7e3c39c6f356dd0256b74', 0, 5),
(525, 365, 'Intermediate Seeker.skr', 3.5, 140, 'Seeker', 0, '', '47429a6227e6b43d7456c95d5f2fc2b7', 0, 6),
(526, 365, 'Competent Spam.vspam', 4, 148, 'Spam virus', 0, 'virus', '30aa1fd0de00490302b6937e306626ad', 0, 8),
(527, 365, 'Competent Collector.vcol', 4, 172, 'Virus collector', 0, 'vcol', '5ab1860eea6af8c2c37960d84b48bdd3', 0, 10),
(528, 365, 'Intermediate FTP Exp.exp', 3, 128, 'FTP Exploit', 0, '', '25e47b14ecc3b060f202506d1c33ca04', 0, 11),
(529, 365, 'Intermediate SSH Exp.exp', 3, 128, 'SSH Exploit', 0, '', '33e870dfcf7bf74e57f9fd20e79b449d', 0, 12),
(530, 366, 'Basic Cracker.crc', 1.3, 37, 'Cracker', 1, '', '028ad5f9a20ca121f275289572d967b1', 0, 1),
(531, 366, 'Basic Hasher.hash', 1.2, 31, 'Hasher', 1, '', '3cf63ffab9e4cd9bb5775b5255cfe1dd', 0, 2),
(532, 366, 'Basic Firewall.fwl', 1.2, 28, 'Firewall', 1, '', '444ec2ae30bdd3cc532865768f546472', 0, 4),
(533, 366, 'Basic Hidder.hdr', 1.1, 18, 'Hidder', 0, '', '08b1b41e63e10bc33b0db2ee90417822', 0, 5),
(534, 366, 'Basic Seeker.skr', 1, 17, 'Seeker', 0, '', '2f83a01e489156c43a60e6387ce13cc0', 0, 6),
(535, 366, 'Basic DDoS.vddos', 1, 15, 'DDoS virus', 0, 'virus', 'd6b6fca5fb87260fae76376acbc887b8', 0, 9),
(536, 366, 'Basic Breaker.vbrk', 1, 16, 'DDoS breaker', 0, '', '9e0c246b38d654ea9e803438d0bfe432', 0, 11),
(537, 366, 'Basic FTP Exploit.exp', 1.1, 23, 'FTP Exploit', 0, '', '2e6ac5f86d57d980161f52057e611a16', 0, 11),
(538, 366, 'Basic SSH Exploit.exp', 1, 21, 'SSH Exploit', 0, '', '75c7b6710dbb36dbec70d239b8c5d9b3', 0, 12),
(539, 367, 'Generic Cracker.crc', 1.5, 46, 'Cracker', 1, '', '1bc9fe7d1dfe768be338fa7983d6bc39', 0, 1),
(540, 367, 'Basic Hasher.hash', 1.4, 38, 'Hasher', 1, '', '4162fe856ea21249d5df2b75a62b6ba1', 0, 2),
(541, 367, 'Basic Firewall.fwl', 1.4, 35, 'Firewall', 1, '', 'd2071de122eddda69f2c010fb754fa87', 0, 4),
(542, 367, 'Basic Hidder.hdr', 1.3, 23, 'Hidder', 0, '', 'ecca11bb56d25387971a666b871602df', 0, 5),
(543, 367, 'Basic Seeker.skr', 1, 17, 'Seeker', 0, '', '2f83a01e489156c43a60e6387ce13cc0', 0, 6),
(544, 367, 'Generic Anti-Virus.av', 1.5, 30, 'Antivirus', 0, 'av', 'f60403404acd7a4b8d4d1b1ebbe75102', 0, 7),
(545, 367, 'Generic Spam.vspam', 1.5, 22, 'Spam virus', 0, 'virus', 'bd773a694f2c806eeec518e95ed6f576', 0, 8),
(546, 367, 'Generic Collector.vcol', 1.5, 26, 'Virus collector', 0, 'vcol', '029ed7f5a519b08a1d9d08f4f24145af', 0, 10),
(547, 367, 'Generic FTP Exploit.exp', 1.8, 47, 'FTP Exploit', 0, '', '09c775d1f14a7c102569d2d7a013cf0f', 0, 11),
(548, 368, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(549, 371, 'Generic Cracker.crc', 1.9, 69, 'Cracker', 1, '', '663a5671ac7f7391da39d1f2b0153f62', 0, 1),
(550, 371, 'Generic Firewall.fwl', 1.7, 47, 'Firewall', 1, '', '4649c55a5b1f63cb5555f3b8345c9c18', 0, 4),
(551, 371, 'Basic Spam.vspam', 1.1, 15, 'Spam virus', 0, 'virus', '9d1d9264383f32a6a6f6034f51500080', 0, 8),
(552, 372, 'Intermediate Cracker.crc', 3.8, 276, 'Cracker', 1, '', '4b0eb3142c6a7a44b24c65e70bc1b3f4', 0, 1),
(553, 372, 'Advanced Hasher.hash', 5.4, 532, 'Hasher', 1, '', '34763037eb6a2236919bb31d6e1a42b8', 0, 2),
(554, 372, 'Competent Firewall.fwl', 4, 258, 'Firewall', 1, '', 'd4976a2305d2a6c04abcce5dcf6567c1', 0, 4),
(555, 372, 'Decent Spam.vspam', 2, 36, 'Spam virus', 0, 'virus', '181664df49d33cf1763d501f49360a39', 0, 8),
(556, 373, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(557, 374, 'Intermediate Cracker.crc', 3.5, 232, 'Cracker', 1, '', '198c55ff1c45a3a0a927c35ba573781c', 0, 1),
(558, 374, 'Intermediate Hasher.hash', 3.3, 189, 'Hasher', 1, '', '55a774a439aae02961dc41e21a91ca56', 0, 2),
(559, 374, 'Decent Firewall.fwl', 2.8, 123, 'Firewall', 1, '', 'd9c40645fd00e4c9f3d3bc67deeeba29', 0, 4),
(560, 374, 'Basic Hidder.hdr', 1.2, 20, 'Hidder', 0, '', '6f2842a86037cae6b8dee85fffab45c2', 0, 5),
(561, 374, 'Decent Spam.vspam', 2.2, 44, 'Spam virus', 0, 'virus', 'b3a61973941c6a647b91f5763598f513', 0, 8),
(562, 375, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(563, 376, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(564, 378, 'Amazing Hasher.hash', 8, 1.2, 'Hasher', 1, '', 'e2fd5d5320d81baef15272b28720ef90', 0, 2),
(565, 378, 'Amazing Firewall.fwl', 8, 1.1, 'Firewall', 1, '', 'b8f928398b38c1faed6cfd321f807847', 0, 4),
(566, 379, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(567, 363, 'Decent Cracker.crc', 2, 75, 'Cracker', 1, '', 'd56004d18ac7d01486cce6c0a2256932', 0, 1),
(568, 363, 'Decent Hasher.hash', 2.2, 83, 'Hasher', 1, '', 'f2e4779c3219cd1a8b5a279f7a67ad1d', 0, 2),
(569, 363, 'Basic Port Scan.scan', 1, 23, 'Port Scan', 0, 'scan', 'b53ef3122382e8143f3f956d3ccd552d', 0, 3),
(570, 363, 'Basic Firewall.fwl', 1, 23, 'Firewall', 1, '', '25b37baba34bcba2133c66c2f349eb12', 0, 4),
(571, 363, 'Generic FTP Exploit.exp', 1.6, 39, 'FTP Exploit', 0, '', '4337b82ec4a4c41550efc27b26c84036', 0, 11),
(572, 363, 'Generic SSH Exploit.exp', 1.7, 43, 'SSH Exploit', 0, '', '36a85e7a6ad613fdb99bd954cffdabee', 0, 12),
(573, 356, 'Basic Hasher.hash', 1, 26, 'Hasher', 1, '', 'e0cbd69804b2bfbe71be154f69744c48', 0, 2),
(574, 343, 'Competent Cracker.crc', 4.4, 375, 'Cracker', 1, '', 'b4672b9b8701b25ec3474a35b201ea5e', 0, 1),
(575, 343, 'Intermediate Hasher.hash', 3.8, 254, 'Hasher', 1, '', 'f72ce9d90feacf24dd9a81afa6a5f581', 0, 2),
(576, 343, 'Decent Firewall.fwl', 2.8, 123, 'Firewall', 1, '', 'd9c40645fd00e4c9f3d3bc67deeeba29', 0, 4),
(577, 343, 'Generic Spam.vspam', 1.9, 33, 'Spam virus', 0, 'virus', '8ead915e75be6756e477539cca942b81', 0, 8),
(578, 343, 'Competent FTP Exploi.exp', 4, 234, 'FTP Exploit', 0, '', 'be9107725663f76fe6d1c5464e7aeb21', 0, 11),
(579, 343, 'Intermediate SSH Exp.exp', 3.3, 156, 'SSH Exploit', 0, '', '14d0225e3bb1f7d22af7588db4c932fd', 0, 12),
(580, 347, 'Advanced Cracker.crc', 5.2, 534, 'Cracker', 1, '', '2b5b2270cf5007bb79e0fb2e9a413ca2', 0, 1),
(581, 347, 'Advanced Hasher.hash', 5.6, 574, 'Hasher', 1, '', '977da64416ee22b556c69e0fb96ea64f', 0, 2),
(582, 347, 'Intermediate Firewal.fwl', 3, 142, 'Firewall', 1, '', '053f12895c9ef51c37a53859c3fe5ccc', 0, 4),
(588, 353, 'Basic Spam.vspam', 1, 14, 'Spam virus', 1, 'virus', '11d2469096e43aefe97ec1be83f73f5b', 0, 8);

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`UID`);

--
-- Index för tabell `account_information`
--
ALTER TABLE `account_information`
  ADD PRIMARY KEY (`userID`);

--
-- Index för tabell `active_virus`
--
ALTER TABLE `active_virus`
  ADD PRIMARY KEY (`ID`);

--
-- Index för tabell `bank_account`
--
ALTER TABLE `bank_account`
  ADD PRIMARY KEY (`ID`);

--
-- Index för tabell `bitcoin`
--
ALTER TABLE `bitcoin`
  ADD PRIMARY KEY (`userID`);

--
-- Index för tabell `hackedlist`
--
ALTER TABLE `hackedlist`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `hardware_server`
--
ALTER TABLE `hardware_server`
  ADD UNIQUE KEY `id` (`id`);

--
-- Index för tabell `mail`
--
ALTER TABLE `mail`
  ADD PRIMARY KEY (`ID`);

--
-- Index för tabell `online`
--
ALTER TABLE `online`
  ADD PRIMARY KEY (`session`);

--
-- Index för tabell `process`
--
ALTER TABLE `process`
  ADD PRIMARY KEY (`pid`);

--
-- Index för tabell `server`
--
ALTER TABLE `server`
  ADD PRIMARY KEY (`ID`);

--
-- Index för tabell `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `account`
--
ALTER TABLE `account`
  MODIFY `UID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10039;
--
-- AUTO_INCREMENT för tabell `account_information`
--
ALTER TABLE `account_information`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10011;
--
-- AUTO_INCREMENT för tabell `active_virus`
--
ALTER TABLE `active_virus`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT för tabell `bank_account`
--
ALTER TABLE `bank_account`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
--
-- AUTO_INCREMENT för tabell `hackedlist`
--
ALTER TABLE `hackedlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;
--
-- AUTO_INCREMENT för tabell `hardware_server`
--
ALTER TABLE `hardware_server`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=851;
--
-- AUTO_INCREMENT för tabell `mail`
--
ALTER TABLE `mail`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT för tabell `process`
--
ALTER TABLE `process`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `server`
--
ALTER TABLE `server`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=382;
--
-- AUTO_INCREMENT för tabell `software`
--
ALTER TABLE `software`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=590;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
