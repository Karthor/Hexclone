<?php
require_once('autoload.php');

if($_POST){
    
$user = input::post("username");
$pass = input::post("password");

account::login($user,$pass);
redirect::go("index.php");
}