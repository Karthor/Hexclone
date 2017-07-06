<?php

class Bank {

	public static function createAccount($ip){
                $ip = database::escapeString($ip);
		$addr = rand(111111111,999999999);
		$userID = session::get("uid");
		$sql = "INSERT INTO bank_account (addr, ip, userid) VALUES ('$addr', '$ip', '$userID')";
		if (database::$conn->query($sql) === TRUE) { }
	}
	
	public static function getAccount(){
		database::setTable("bank_account");
		return database::selectMulti("userid", session::get("uid"),''," ORDER BY money DESC");
	}
	
	public static function isCreated($ip){
		$uid = session::get("uid");
		$sql = "SELECT * FROM bank_account WHERE ip = '$ip' and userid = '$uid'";	
		$result = mysqli_query(database::$conn,$sql);
		return mysqli_fetch_array($result,MYSQLI_ASSOC);
	}
        
        public static function canIAfford($price, $account) {
            database::setTable("bank_account");
            $money_now = database::select("addr", $acc)["money"];
            
            if($money_now < $price){
                return true;
            } else {
                return false;
            }
        }
        
        public static function pay($acc, $value) {
            database::setTable("bank_account");
            $money_now = database::select("addr", $acc)["money"];
            
            if($money_now > $value){
               database::update("addr", $acc, "money", $money_now-$value); 
                return true;
            } else {
                return false;
            }
        }
        
        public static function receive($acc, $value) {
            database::setTable("bank_account");
            $money_now = database::select("addr", $acc)["money"];
            database::update("addr", $acc, "money", $money_now+$value); 
        }
        
        public static function loadJSON() {
            $data = self::getAccount(account::getUserID());
            
            $json .= 'Account: <select id="select-bank-acc" name="acc">';
            
            for ($x = 0; $x < sizeof($data); $x++){
                $json .= '<option value="'. $data[$x]["addr"] .'">#'. $data[$x]["addr"] .' ($'. number_format($data[$x]["money"]) .')</option>';
            }
            
            $json .= '</select>';
            
            return $json;
        }
	
	public static function totalWorth(){
		$data = self::getAccount();
		
		for ($x = 0; $x < sizeof($data); $x++) {
			$worth += $data[$x]["money"];
		} 
			return $worth;
	}
}

?>