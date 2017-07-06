<?php

class redirect {

    public static function go($page, $seconds=0){
        $f_page = basename($_SERVER['SCRIPT_FILENAME']);
        session::set("from_page", $f_page);
        session::set("to_page", $page);
        if($seconds == 0){
            header('location: ' . $page);
            exit;
        } else {
            header('Refresh: '. $seconds .'; URL='. $page);
        }
        
    }
    
    public static function getTo() {
        if(session::isLoaded()){
            return session::get("to_page");
        }
    }
    
    public static function getFrom() {
        if(session::isLoaded()){
            return session::get("from_page");
        }
    }
}
