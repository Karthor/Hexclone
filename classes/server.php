<?php

class server {
    
    public static function setIP($ip, $serverID){
        database::setTable("server");
        database::update("id", $serverID, "ip", $ip);
    }
	
    
    public static function getIP($serverID){
        database::setTable("server");
        $data = database::select('ID', $serverID);
        return $data["ip"];
    }
  
    public static function loadByIP($ip) {
        database::setTable("server");
        return database::select("ip", $ip);
    }
    
    public static function loadByServerID($serverID) {
        database::setTable("server");
        return database::select("id", $serverID);
    }
}