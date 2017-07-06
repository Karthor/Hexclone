<?php

class internet {
    
    public static function addHackedList($ip, $uid, $pass) {
        $sql = "INSERT INTO hackedlist (ip, uid, pass) VALUES ('$ip', '$uid', '$pass')";
        database::ExecuteSQL($sql);
    }
    
    public static function getHackedList($userID) {
        database::setTable("hackedlist");
        return database::selectMulti("uid", $userID);
    }
    
    public static function isIP($try_ip) {
        return filter_var($try_ip, FILTER_VALIDATE_IP);
    }
    
    public static function isOnline($ip) {
        if(self::getStatus() == "online" && self::getIP() == $ip){
            return true;
        } else {
            return false;
        }
    }
    
    public static function getUserID($serverID) {
        database::setTable("account");
        $data = database::select("serverID", $serverID);
        return $data["UID"];
    }

    public static function setIP($ip) {
        session::setArray("internet","ip", $ip);
    }
    
    public static function getIP() {
        return session::getArray("internet","ip");
    }
    
    public static function getServerID() {
        return session::getArray("internet","id");
    }
    
    public static function getStatus() {
        return session::getArray("internet","status");
    }
    
    public static function logout() {
        session::setAlert('Disconnected from <a href="internet?ip='. self::getIP() .'">'. self::getIP() .'</a>.', "success", "internet");
        session::setArray("internet","status", 'offline');
        session::setArray("internet","id", '');
        session::setArray("internet","ip", '1.2.3.4');
    }
    
    public static function isHacked($ip, $uid) {
        $sql = "SELECT * FROM hackedlist WHERE ip = '$ip' and uid = '$uid'";
        return database::ExecuteSQL($sql);
    }
    
}
