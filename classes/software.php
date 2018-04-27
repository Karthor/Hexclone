<?php

class software {

    public static function loadHarddrive($serverID){
        database::setTable(software);
        return database::selectMulti("serverID", $serverID, 'ID', " ORDER BY sort ASC");
    }
    
    public static function getSoftwareData($softID){
        database::setTable(software);
        return database::select("ID", $softID);
    }
    
    public static function runAntiVirus($softID, $ip) {
        $data = self::getSoftwareData($softID);
        $avVer = $data["version"];
        $sid = account::getServerID();
        if($ip != "localhost"){
        $sid = internet::getServerID(); 
        }

        database::setTable("active_virus");
        database::deleteMulti("serverID", $sid, '', " AND version <= '$avVer'");
        database::setTable("software");
        database::deleteMulti("serverID", $sid, '', " AND version <= '$avVer' AND installed = 1 and special = 'virus'");
        
        session::setAlert(mysqli_affected_rows(database::$conn) . " viruses removed.","success");
    }
    
    public static function formatHDD($serverID) {
        database::setTable("software");
        database::delete("serverID", $serverID);
    }
    
    public static function copySoftware($softID, $toServerID) {
        database::setTable("software");
        $newID = database::duplicate("ID", $softID);
        database::update("ID", $newID, "serverID", $toServerID);
        database::update("ID", $newID, "installed", 0);
    }
    
    public static function createFile($name, $ext, $serverID) {
        $checksum = md5(uniqid(rand(), true));
        $fullname = $name . $ext;
        $sql = "INSERT INTO software (size, serverID, fullname, special, checksum, type) VALUES ('1', '$serverID', '$fullname', 'text', '$checksum', '$data')";
	database::$conn->query($sql);
    }
    
    public static function getTargetSoftware($serverID, $type, $installed = 1){
        $sql = "SELECT max(version) FROM software WHERE serverID = '$serverID' and type = '$type' and installed = '$installed'";
        $row = database::ExecuteSQL($sql);
        return (float)$row['max(version)'];
    }
    
    public static function loadJSONData($serverID) {
        database::setTable("software");
        $data = database::selectMulti("serverID", $serverID, "type");

        $json .= "[";
        for ($x = 0; $x < sizeof($data); $x++){
        $typeData = database::selectMultiArr("serverID", $serverID, "type", $data[$x]);
            $json .= '{"text":"'. $data[$x] .'","children":[';
            for ($c = 0; $c < sizeof($typeData); $c++){
                
                if($c == sizeof($typeData)-1){
                    $json .= '{"id":"'.$typeData[$c]["ID"].'","text":"'. $typeData[$c]["fullname"] .' ('.number_format($typeData[$c]["version"],1).')"}';
                } else {
                    $json .= '{"id":"'.$typeData[$c]["ID"].'","text":"'. $typeData[$c]["fullname"] .' ('.number_format($typeData[$c]["version"],1).')"},';
                }     
            }
            $json .= ']},';
            $x += sizeof($typeData)-1;
        }
        
        $final = substr($json, 0, -1)."]";  
        return $final;
    }
    
    public static function checkExists($checksum, $serverID) {
        $softData = self::loadHarddrive($serverID);
        
        for ($x = 0; $x < sizeof($softData); $x++){
            $target_checksum = self::getSoftwareData($softData[$x]);
            
            if($checksum == $target_checksum["checksum"]){
                return true;
            }
        }
    return false;
    }
    
    public static function seekSoftware($softID) {
        database::setTable(software);
        database::update("ID", $softID, "hidden", '0');
    }
    
    public static function hideSoftware($softID, $dataTag) {
        database::setTable(software);
        database::update("ID", $softID, "hidden", $dataTag);
    }
   
    public static function installSoftware($softID, $dataIP){
        database::setTable(software);
        database::update("ID", $softID, "installed", 1);
        $data = software::getSoftwareData($softID);
        $base_log = "installed file " . $data["fullname"] . " (" . number_format($data["version"],1) . ")";
        $local_log = "localhost " . $base_log;
        $server_log = "[" . account::getIP() . "] " . $base_log;
        
        if($data["special"] == "virus"){ 
            
            if($data["type"] == "Spam virus"){
                $type = "spam";
            } elseif($data["type"] == "Warez virus"){
                $type = "warez";
            } elseif($data["type"] == "Bitcoin Miner"){
                $type = "miner";
            } elseif($data["type"] == "DDoS virus"){
                $type = "ddos";
            }
            
            self::setActiveVirus($softID, internet::getServerID(), account::getUserID(), $data["version"], $type); 
        } 
        
        if($dataIP == "localhost"){
            putLogIP($local_log,account::getIP());
        } else {
            putLogIP($local_log . " at [" . $dataIP . "]",account::getIP());
            putLogIP($server_log,$dataIP);
        }
    }
    
    public static function setActiveVirus($softID, $installedSID, $ownerID, $version, $type){
        $sql = "INSERT INTO active_virus (virusID, serverID, ownerID, version, type) VALUES ('$softID', '$installedSID', '$ownerID', '$version', '$type')";
	database::$conn->query($sql);
    }
    
    public static function getIcon($type) {
        switch ($type) { 
        case "Cracker": $img = "he16-1"; break;
        case "Hasher": $img = "he16-2"; break;   
        case "Port Scan": $img = "he16-3"; break;
        case "Firewall": $img = "he16-4"; break;
        case "Hidder": $img = "he16-5"; break;
        case "Seeker": $img = "he16-6"; break;
        case "Antivirus": $img = "he16-7"; break;
        case "Virus collector": $img = "he16-11"; break;
        case "DDoS breaker": $img = "he16-12"; break;
        case "FTP Exploit": $img = "he16-13"; break;
        case "SSH Exploit": $img = "he16-14"; break;
        case "Nmap": $img = "he16-15"; break;
        case "Analyzer": $img = "he16-16"; break;
        case "Torrent": $img = "he16-17"; break;
        case "Text": $img = "he16-30"; break;
        case "Web server": $img = "he16-18"; break;
        case "Spam virus": $img = "he16-8"; break;
        case "WareZ virus": $img = "he16-9"; break;
        case "DDoS virus": $img = "he16-9";  break;
        case "Bitcoin Miner": $img = "he16-20"; break;
        }
    return $img;
    }
    
    public static function killSoftware($softID, $dataIP){
        $data = software::getSoftwareData($softID);
        database::setTable(software);
        database::update("ID", $softID, "installed", 0); 
        
        $base_log = "uninstalled file " . $data["fullname"] . " (" . number_format($data["version"],1) . ")";
        $local_log = "localhost " . $base_log;
        $server_log = "[" . account::getIP() . "] " . $base_log;
        
        if($dataIP == "localhost"){
            putLogIP($local_log,account::getIP());
        } else {
            putLogIP($local_log . " at [" . $dataIP . "]",account::getIP());
            putLogIP($server_log,$dataIP);
        }
    }
    
    public static function deleteSoftware($softID,$dataIP) {
        $data = software::getSoftwareData($softID);
        database::setTable(software);
        database::delete("ID", $softID);
        
        $base_log = "deleted file " . $data["fullname"] . " (" . number_format($data["version"],1) . ")";
        $local_log = "localhost " . $base_log;
        $server_log = "[" . account::getIP() . "] " . $base_log;
        
        if($dataIP == "localhost"){
            putLogIP($local_log,account::getIP());
        } else {
            putLogIP($local_log . " at [" . $dataIP . "]",account::getIP());
            putLogIP($server_log,$dataIP);
        }
    }
    
    public static function setID($ID, $installed){
	if($installed == 1){
		return '<tr id="'. $ID .'" class="installed">';
	} else {
		return '<tr id="'. $ID .'" class="">';
	}
    }

    public static function setName($data){
        $fullname = htmlspecialchars($data["fullname"]);

        if($data["special"] == "virus"){
            if($data["installed"] == 1){
                return '<td><span class="he16-96 tip-top" title="Virus"></span></td><td>'. $fullname .'</td>';  
            } else {
               return '<td><span class="'. self::getIcon($data["type"]) .' tip-top" title="Virus"></span></td><td>'. $fullname .'</td>';
            }
        } 
        
        if($data["special"] == "text"){
             return '<td><span class="he16-30 tip-top" title="Text file"></span></td><td>'. $fullname .'</td>';  
        }
        
        if($data["installed"] == 1){ 
            return '<td><span class=' . self::getIcon($data["type"]) .' tip-top" title="'. $data["type"] .'"></span></td><td><b>'. $fullname .'</b></td>';
        } else {
            return '<td><span class='. self::getIcon($data["type"]) .' tip-top" title="'. $data["type"] .'"></span></td><td>'. $fullname .'</td>';
        }    
    }



    public static function setVersion($version){
        if($version < 7){
                return '<td><font color="green">'. number_format($version,1) .'</font></td>';
        } elseif  ($version < 15) {
                return '<td><font color="red">'. number_format($version,1) .'</font></td>';
        } else {
                return '<td><font color="red"><b>'. number_format($version,1) .'</b></font></td>';
        }
    }

    public static function formatSize($size) {
        if($size>=1000){
            
            return (number_format($size/1000,1)+0) . " GB";
        } else {
            return (number_format($size,1)+0) . " MB";
        }
    }
    
    public static function setSize($size){
        if($size < 100){
          return '<td><font color="green">'. self::formatSize($size) .'</font></td>';  
        } elseif ($size <= 500){
            return '<td><font color="#003300">'. self::formatSize($size) .'</font></td>'; 
        } else {
            return '<td><font color="red">'. self::formatSize($size) . '</font></td>';  
        }

    }


    public static function setAttributes($data,$internet){
        $attri = "<td style='text-align: center'>\r\n";   
        
        
        if($data["hidden"] != 0){
            $version = number_format($data["hidden"],1);
            $code = "<a href='?action=seek&id={$data["ID"]}' class='tip-top' title='Seek (hidden with {$version})'><span class='he16-search'></span></a>\r\n";
        } else {
            $code = "<a href='?action=hide&id={$data["ID"]}' class='tip-top' title='Hide'><span class='he16-hide'></span></a>\r\n";
        }

        switch ($data["special"]) { 
            case "virus":
                if($data["installed"] == 1){
                    $attri .= "<a href='?view=software&id={$data["ID"]}' class='tip-top' title='Information'><span class='he16-software_info'></span></a>\r\n";
                    if($internet){ $attri .= "<span class='he16-transparent'></span>\r\n"; }
                    if($internet == 0 && internet::getStatus() == "online"){$attri .= "<span class='he16-transparent'></span>\r\n"; }
                    $attri .= "<span class='he16-transparent'></span>\r\n";
                    $attri .= $code;
                    $attri .= "<span class='he16-transparent'></span>\r\n";  
                } else {
                    $attri .= "<a href='?view=software&id={$data["ID"]}' class='tip-top' title='Information'><span class='he16-software_info'></span></a>\r\n";
                    if($internet){ $attri .= "<a href='internet?view=software&cmd=dl&id={$data["ID"]}' class='tip-top' title='Download'><span class='he16-download'></span></a>"; }
                    if($internet == 0 && internet::getStatus() == "online"){ $attri .= "<a href='internet?view=software&cmd=up&id={$data["ID"]}' class='tip-top' title='Upload to ". internet::getIP() ."'><span class='he16-upload'></span></a>"; }
                    $attri .= "<a href='?action=install&id={$data["ID"]}' class='tip-top' title='Run'><span class='he16-cog'></span></a>\r\n";
                    $attri .= $code;
                    $attri .= "<a href='?action=del&id={$data["ID"]}' class='tip-top' title='Delete'><span class='he16-bin'></span></a>\r\n";
                }
            break;
            case "text":
                $attri .= "<span class='he16-transparent'></span>\r\n";
                if($internet){ $attri .= "<a href='internet?view=software&cmd=dl&id={$data["ID"]}' class='tip-top' title='Download'><span class='he16-download'></span></a>"; }
                if($internet == 0 && internet::getStatus() == "online"){ $attri .= "<a href='internet?view=software&cmd=up&id={$data["ID"]}' class='tip-top' title='Upload to ". internet::getIP() ."'><span class='he16-upload'></span></a>"; }
                $attri .= "<span class='he16-transparent'></span>\r\n";
                $attri .= $code;
                $attri .= "<a href='?action=del&id={$data["ID"]}' class='tip-top' title='Delete'><span class='he16-bin'></span></a>\r\n";
            break;
            default:
                $attri .= "<a href='?id={$data["ID"]}' class='tip-top' title='Information'><span class='he16-software_info'></span></a>\r\n";
                if($internet){ $attri .= "<a href='internet?view=software&cmd=dl&id={$data["ID"]}' class='tip-top' title='Download'><span class='he16-download'></span></a>"; }
                if($internet == 0 && internet::getStatus() == "online"){ $attri .= "<a href='internet?view=software&cmd=up&id={$data["ID"]}' class='tip-top' title='Upload to ". internet::getIP() ."'><span class='he16-upload'></span></a>"; }
                    if($data["installed"] == 1){
                        $attri .= "<a href='?action=uninstall&id={$data["ID"]}' class='tip-top' title='Kill'><span class='he16-stop'></span></a>\r\n";
                        $attri .= "<span class='he16-transparent'></span>\r\n";    
                    } else {
                        $attri .= "<a href='?action=install&id={$data["ID"]}' class='tip-top' title='Run'><span class='he16-cog'></span></a>\r\n";
                        $attri .= $code;
                    }
                $attri .= "<a href='?action=del&id={$data["ID"]}' class='tip-top' title='Delete'><span class='he16-bin'></span></a>\r\n";
            break;
        }  
        
    $attri .= "</td>\r\n</tr>\r\n";
    return $attri;
    }
    
    public static function checkUsedSpace($serverID) {
        $data = self::loadHarddrive($serverID);
        $size = 0;
        for ($x = 0; $x < sizeof($data); $x++){
           $softInfo = self::getSoftwareData($data[$x]);
           $size += $softInfo["size"];
        }
    return $size;
    }
    
    public static function getSoftwares($data, $internet){
    $GLOBALS["soft_data"] = '';

        for ($x = 0; $x < sizeof($data); $x++){
        $GLOBALS["soft_data"] .= self::showSoftware($data[$x], $internet); 
        } 
	
    return $GLOBALS["soft_data"];
    }
    
public static function showSoftware($ID, $internet){
$data = self::getSoftwareData($ID);
$size = $data['size'];

$html_id = self::setID($ID, $data['installed']);
$html_name = self::setName($data);
$html_ver = self::setVersion($data['version']);
$html_size = self::setSize($size);
$html_attr = self::setAttributes($data, $internet);
$GLOBALS["size_used"] += $size;

$htmlCode = <<< CODE2
$html_id
$html_name
$html_ver
$html_size
$html_attr
CODE2;


if($data["hidden"]!=0){ /* File is hidden! */
    $seeker = software::getTargetSoftware(account::getServerID(), "Seeker");
    if($seeker >= $data["hidden"]){
        return $htmlCode;
    }
    
} else {
return $htmlCode;  
}


}

}
