<?php

class account {
	
    public static function register($username, $password, $email){
        $username = database::escapeString($username);
        $password = database::escapeString($password);
        $email = database::escapeString($email);
        $newIP = GenerateIP();
        $serverPassword = GeneratePass();
        $addr = rand(111111111,999999999);
        $sql = "INSERT INTO server (extra, ip, user, pass, type) VALUES ('VPC', '$newIP', 'root', '$serverPassword', 'vpc')";
        database::$conn->query($sql);
        $serverID = mysqli_insert_id(database::$conn);
        $sql = "INSERT INTO account (username, password,serverID,email) VALUES ('$username', '$password', '$serverID', '$email')";
        database::$conn->query($sql);
        $userID = mysqli_insert_id(database::$conn);
        $sql = "INSERT INTO bank_account (addr, ip, userid, money) VALUES ('$addr', '206.211.30.54', '$userID', '2147483647')";
        database::$conn->query($sql);
        $sql = "INSERT INTO hardware_server (uid) VALUES ('$userID')";
        database::$conn->query($sql);
        session::setAlert("Your account is now created!", "success");
        //Registration complete. Check your email for confirmation link.
    }
    
    public static function delete($userID) {
        database::setTable("account");
        $info = database::select("UID", $userID);
        $serverID = $info["serverID"];
        
        /* Delete the users account */
        database::setTable("account");
        database::delete("UID", $userID);
        
        /* Delete all the users bank accounts */
        database::setTable("bank_account");
        database::delete("userid", $userID);
        
        /* Delete all the users hacked ips in his list */
        database::setTable("hacked_list");
        database::delete("userid", $userID);
        
        /* Delete all the users servers */
        database::setTable("hardware_server");
        database::delete("userid", $userID);
        
        /* Delete all the users mail */
        database::setTable("mail");
        database::delete("toID", $userID);
        
        /* Delete all the users active processes */
        database::setTable("process");
        database::delete("userID", $userID);
        
        /* Delete the users server */
        database::setTable("server");
        database::delete("ID", $serverID);
        
        /* Delete all the softwares on the server */
        database::setTable("software");
        database::delete("serverID", $serverID);
    }
    
    public static function login($username, $password) {
        database::setTable("account");
        $data = database::select("username", $username);

        if(password_verify($password, $data["password"])){
            self::checkOnline();
            self::setUsername($username);
            self::setUserID($data['UID']);
            self::setMoney(bank::totalWorth());
            session::set("reputation", $data["reputation"]);
            session::set("serverID", self::loadServerID());
            session::set("access", $data["access_level"]);
            session::set("unreadMail", self::getUnreadMail(self::getUserID()));
            session::set("ip", server::getIP(self::getServerID()));
            session::set("servers",hardware::loadData(self::getUserID()));
            session::set("servers_num", sizeof(self::getHardwareData()));
            session::set("netID", hardware::LoadNetID(self::getServerID()));
            session::setArray("internet", "status", "offline");
            session::set("logged", 1);
        } else {
            session::setAlert("Wrong password or username!", "danger");
	}
    }
    
    public static function checkOnline() {
        $session = session::getID();
        $time=time();
        $time_check=$time-1440; //SET TIME 10 Minute
        
        if(database::ExecuteSQL("SELECT * FROM online WHERE session='$session' and time<'$time_check'"))
        {
            $sql="DELETE FROM online WHERE session='$session'";
            database::$conn->query($sql); 
            session::setAlert("You have been disconnected due to inactivity!", "danger");
            session::set("logged", 0);
            return 0;
        }
        
        $sql="SELECT * FROM online";
        $result=mysqli_query(database::$conn, $sql);
        $count_user_online=mysqli_num_rows($result);
        
        database::setTable("online");
        $data = database::select("session", $session);
        
        if($data){
            database::setTable("online");
            database::update("session", $session, "time", $time);
            database::update("session", $session, "userID", account::getUserID());
        } else {
           $sql = "INSERT INTO online (session, time) VALUES ('$session', '$time')";
           database::$conn->query($sql); 
        }
        
        $sql="DELETE FROM online WHERE time<$time_check";
        database::$conn->query($sql); 
        
        return $count_user_online;
    }
   
    public static function getMail() {
        database::setTable("mail");
        return database::selectMulti("toID", account::getUserID());
    }
   
    public static function getUnreadMail() {
        database::setTable("mail");
        return sizeof(database::selectMultiArr("toID", account::getUserID(), "seen", 0));
    }
    
    public static function sendMail($title, $message, $toUser, $fromUser) {
        $message = database::escapeString($message);
        $title = database::escapeString($title);
        $toUser = database::escapeString($toUser);
        
        database::setTable("account");
        $data = database::select("username", $toUser);
        
        if($data){
            
            $to = $data["UID"];
            $sql = "INSERT INTO mail (title, message, fromID, toID) VALUES ('$title', '$message', '$fromUser', $to)";
            echo $to;
            if(database::$conn->query($sql)){
                return true;
                
            }   
        }
    return false;
    }
    
    public static function setLastCollectInfo($time, $money, $acc, $bonus, $ip) {
        $userID = self::getUserID();
        database::setTable("account_information");
        $data = database::select("userID", $userID);

        if($data){
            $sql = "UPDATE account_information SET last_collected_worked='$time', last_collected_generated='$money', last_collected_acc='$acc', last_collected_bonus='$bonus', last_collected_ip='$ip' WHERE userID='$userID'";
            database::$conn->query($sql);
        } else {
            $sql = "INSERT INTO account_information (userID, last_collected_worked, last_collected_generated, last_collected_acc, last_collected_bonus, last_collected_ip) VALUES ('$userID','$time', '$money', '$acc', '$bonus', '$ip')";
            database::$conn->query($sql);
        }
        
    }
    
    /* Get Functions */
    
    public static function getIP(){
       return session::get("ip");
    }
    
    public static function getAccess(){
        return session::get("access");
    }
    
    public static function getUserID(){
       return session::get("uid");
    }
    
    public static function getServerID(){
        return session::get("serverID");
    }
    
    public static function getMoney() {
        return session::get("money");
    }
    
    public static function getHardwareData() {
        return session::get("servers");
    }
    
    public static function getUsername() {
        session::get("username");
    }
    
    public static function loadServerID(){
        database::setTable("account");
        $data = database::select("uid", self::getUserID());
        return $data['serverID'];
    }
    
    /* Set Functions */
    
    public static function setUserID($id){
        session::set("uid",$id);
    }
    
    public static function setUsername($username){
        session::set("username",$username);
    }
    
    public static function setMoney($value) {
        session::set("money", $value);
    }
    
    public static function check_username($username) {
        database::setTable("account");
        $data = database::select("username", $username);
        
        if($data){
            return "false";
        } else {
            return "true";
        }
    }
    
    public static function check_email($email) {
        database::setTable("account");
        $data = database::select("email", $email);
        
        if($data){
            return "false";
        } else {
            return "true";
        }
    }
    
}
