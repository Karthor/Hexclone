<?php
include('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

resetIP();

?>