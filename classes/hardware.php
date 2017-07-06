<?php

class hardware {
    
    public static function UpdateCollect($userID) {
        database::setTable("account");
        database::update("UID", $userID, "collected", strtotime("now"));
    }
    
    public static function getLastCollected($userID) {
        database::setTable("account");
        $data = database::select("UID", $userID);
        return $data["collected"];
    }
    
    public static function loadData($userID){
        database::setTable("hardware_server");
        $data = database::selectMulti("uid", $userID);
        return $data;
    }
    
    public static function loadNetID($serverID){
       database::setTable("server");
       $data = database::select("id", $serverID);
       return $data['net_id'];
    }
    
    public static function loadServerHardware($hardID) {
        database::setTable("hardware_server");
        return database::select("id", $hardID);
    }

    public static function upgradeNet($netID) {
        $serverID = account::getServerID();
        database::setTable("server");
        database::update("ID", $serverID, "net_id", $netID);
    }
    
    public static function UpgradeRAM($hardID, $partID){
        database::setTable("hardware_server");
        database::update("id", $hardID, "ram_id", $partID);
    }
    
    public static function UpgradeCPU($hardID, $partID){
        database::setTable("hardware_server");
        database::update("id", $hardID, "cpu_id", $partID);
    }
    
    public static function UpgradeHDD($hardID, $partID){
        database::setTable("hardware_server");
        database::update("id", $hardID, "hdd_id", $partID);  
    }
    
    public static function buyServer($userID){
        $sql = "INSERT INTO hardware_server (uid) VALUES ('$userID')";
        if (database::$conn->query($sql) === TRUE) { }
        
    }
}
