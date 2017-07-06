<?php
require_once('autoload.php');

$options = [
    'cost' => 11,
];

$username = input::post("username");
$email = input::post("email");
$password = input::post("password");

$username_vaild = array('-', '_');
$password_vaild = array('-', '_', '!', '#', '%', '&', '@', '/');

if($_POST['terms'] == 1){
	if((strlen($password) >= 6) && (strlen($username) >= 3) && filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(ctype_alnum(str_replace($username_vaild, '', $username)) && ctype_alnum(str_replace($password_vaild, '', $password)) ){
			if(account::check_username($username) && account::check_email($email)){
				$pass = password_hash($password, PASSWORD_BCRYPT, $options);
				account::register($username, $pass, $email);
			}
		}
	}		
	header('location: index.php');
}

