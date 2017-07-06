<?php

class processes {
    
    public static $noRe = 0;
    
    public static function getAmount($userID){ 
        database::setTable("account");
        $data = database::select("uid", $userID);
        return $data['tasks'];
    }

    public static function setRedirect($val) {
        self::$noRe = $val;
    }
    
    public static function setAmount($userID, $amount) {
        database::setTable("account");
        database::update("uid", $userID, "tasks", $amount);
    }

    public static function loadAll($userID) {
        database::setTable("process");
        return database::selectMulti("userID", $userID);
    }

    public static function load($uid, $pid) {
        $sql = "SELECT * FROM process WHERE userID = '$uid' AND pid = '$pid'";
        return database::ExecuteSQL($sql);
    }

    public static function delete($uid, $pid) {
        $sql = "DELETE FROM process WHERE pid=$pid AND userID=$uid";
        return database::ExecuteSQL($sql);
    }
    
    public static function isWorking($checksum) {
        database::setTable(process);
        $procData = database::selectMultiArr("data_tag", $checksum, "userID", account::getUserID());
        
        if(self::isComplete($procData[0]["pid"])){
            return 0;
        }
        
        return $procData[0]["pid"];
    }
    
    public static function create($time, $title, $action, $dataID, $redirect, $data_tag = '', $forceIP = ''){
        $ip = internet::getIP();
        $act = database::escapeString($action);
        $dataID = database::escapeString($dataID);
        $redirect = database::escapeString($redirect);
        $data_tag = database::escapeString($data_tag);
        $forceIP = database::escapeString($forceIP);
        $UID = account::getUserID();
        
        
        
        if(!$ip){
            if(internet::getStatus() == "offline"){
                $ip = "localhost";
            }
        }
        
        if($forceIP){
            $ip = $forceIP;
        }
        
        $sql = "INSERT INTO process (end_time,  action, data_ip, data_id, redirect, userID, title, data_tag) 
        VALUES (DATE_ADD(NOW(), INTERVAL $time SECOND), '$act', '$ip', '$dataID', '$redirect', '$UID', '$title', '$data_tag')";
        
        database::$conn->query($sql);
        $id = mysqli_insert_id(database::$conn);
        if(self::$noRe == 0){
           header("location: processes.php?pid=". $id); 
        }
        return $id;
    }
    
    public static function isComplete($pid){
        $data = self::load(account::getUserID(), $pid);

        if(!empty($data)){
            $start = strtotime($data["start_time"]);
            $end = strtotime($data["end_time"]);
            $time_left = self::getTimeleft($start, $end);	

            if($time_left == 0){
                self::doProcessComplete($data["action"],$data["data_ip"],$data["data_id"],$data["redirect"], session::get("uid"),$pid,$data["data_tag"]);
                return true;
            }
        }
    }

    public static function getTimeleft($start, $end){
        $_elapsed = time() - $start;
        $_end = $end - $start;
        $_left = $_end - $_elapsed;

            if($_left < 0){
            $_left = 0;	
            }
        return $_left;
    }
    
    public static function doProcessComplete($action, $data_ip, $data_id, $redirect, $uid, $pid, $data_tag){
        if(!internet::isOnline($data_ip) && $data_ip != "localhost" && $action != "Bruteforce"){
            session::setAlert("You must be logged in at ". printLink('internet?ip=' . $data_ip ,$data_ip) ." to complete this process!", "error", $redirect);
            redirect::go($redirect);
        }
        
	switch ($action) {
		case 'editlog': //*editlog
                    if($data_id == 1){
                        log::setLog(account::getIP(), $data_tag);
			session::setAlert("Log successfully edited.","success");
                    } elseif($data_id == 0) {
                        log::setLog($data_ip, $data_tag);
                        session::setAlert("Log successfully edited.","success");
                    }
		break;

		case 'downloadFile':
                    if(checkOK($data_id)){
                    software::copySoftware($data_id, session::get("serverID"));
                    session::setAlert("Software successfully downloaded.","success");
                    }
		break;
                
                case 'uploadFile':
                    $data = server::loadByIP($data_ip);
                    software::copySoftware($data_id, $data["ID"]);
                    session::setAlert("Software successfully uploaded.","success");
                break;
                
                case 'formatHD':
                        software::formatHDD(account::getServerID());
                        session::setAlert("Hard drive successfully formatted.","success");
		break;
		
		case 'deleteFile':
                        software::deleteSoftware($data_id, $data_ip);
                        session::setAlert("Software successfully deleted.","success");
		break;
		
		case 'installFile':
                        software::installSoftware($data_id, $data_ip);
                        session::setAlert("Software successfully installed.","success");
		break;
            
            	case 'hideFile':
                        software::hideSoftware($data_id, $data_tag);
                        session::setAlert("Software successfully hidden.","success");
		break;
            
                case 'seekFile':
                        software::seekSoftware($data_id);
                        session::setAlert("Software successfully seeked.","success");
		break;
		
		case 'uninstallFile':
                        software::killSoftware($data_id, $data_ip);
                        session::setAlert("Software successfully uninstalled.","success");
		break;
            
            	case 'runAV':
                        software::runAntiVirus($data_id, $data_ip);
		break;

		case 'Bruteforce':
                    if(internet::getStatus() == "online"){
                        session::setAlert("You must be logged in at ". printLink('internet?ip=' . $data_ip ,$data_ip) ." to complete this process!", "error");
                        redirect::go($redirect);
                    }
                    
                    internet::setIP($data_ip);
                    internet::addHackedList($data_ip, account::getUserID(), $data_tag);
                    session::setAlert("Successfully cracked ". $data_ip .". Password is <strong>". $data_tag ."</strong>.","success");
		break;
            
                case 'resetIP': 
                     server::setIP($data_tag, account::getServerID());
                break;
        }
            processes::delete($uid, $pid); 
            redirect::go($redirect);
    }
}
