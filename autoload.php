<?php
error_reporting(E_ALL & ~E_NOTICE);
$config = parse_ini_file("config/game_config.ini");
include('functions/lib.func');
include("functions/base.func");
include('functions/game.func');
foreach (glob("classes/*.php") as $filename){ include $filename; } /* Include all files in ../classes */
foreach (glob("classes/html/*.php") as $filename){ include $filename; } /* Include all files in ../classes */
$file_loaded = basename($_SERVER['SCRIPT_FILENAME'], ".php"); /* Get the caller name, and load the functions for that file */

if(array_key_exists($file_loaded, $config)){
include($config[$file_loaded]);
}

session::start();
database::connect();


