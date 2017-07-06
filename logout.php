<?php
require_once('autoload.php');



if (session::isLoaded()){
$session = session::getID();
$sql="DELETE FROM online WHERE session='$session'";
database::$conn->query($sql); 
    
session::destroy();
header('location: index');
}
