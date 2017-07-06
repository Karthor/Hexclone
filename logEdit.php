<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

if(!empty($_POST)){
    if($_POST["id"] == 1){ //change your own log
            if($_POST["log"]){
                    $log = input::post("log");
                    $slog = strip_tags($log);
                    processes::create(4, 'Edit log at <a href="software">localhost</a>', "editlog", 1, "log", $slog, "localhost");
            } else {
                if($_POST["log"] == NULL){
                    processes::create(4, 'Edit log at <a href="software">localhost</a>', "editlog", 1, "log", '', "localhost");
                }
            }
    } elseif($_POST["id"] == 0) { //change log on a server
        if(internet::getStatus() == "online"){
                if($_POST["log"]){
                    $log = input::post("log");
                    $slog = strip_tags($log);
                    
                    processes::create(4, 'Edit log at <a href="software">'. internet::getIP() .'</a>', "editlog", 0, "internet", $slog);
                } else {
                    processes::create(4, 'Edit log at <a href="software">'. internet::getIP() .'</a>', "editlog", 0, "internet", '');
                }
            } else {
        }
    }
}