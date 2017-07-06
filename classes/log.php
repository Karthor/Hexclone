<?php

class log {
    
    public static function setLog($ip, $text, $append=0) {
        database::setTable("server");

        if($append == 1){
            $data = self::getLog($ip);
            $new_text = $text . $data;
            
            database::update("ip", $ip, "log_data", $new_text);
        } else { 
            database::update("ip", $ip, "log_data", $text);
        }
    }
    
    public static function getLog($ip) {
        database::setTable("server");
        $data = database::select("ip", $ip);
        $newString = str_replace('\r\n', PHP_EOL, $data["log_data"]);
        $newString = str_replace('\r',PHP_EOL,$newString);
        $newString = str_replace('\n',PHP_EOL,$newString);
        $newString = str_replace('\\','',$newString);
        return $newString;
        
    }  
}
