<?php
include('autoload.php');



if(empty($_POST["func"])){
	$_POST["func"]="";
}


switch ($_POST["func"]) {
    case "getCommon":
                $umail = account::getUnreadMail();
                $online = account::checkOnline();
                account::setMoney(bank::totalWorth());
		sendJSON('[{"online":"'. $online .'","unread":"'. $umail .'","mission_complete":"0","finances":"'. number_format(account::getMoney()) .'","unread_title":"Unread messages.","unread_text":"You have '. $umail .' unread messages.","online_title":"'. $online .' online players","finances_title":"Finances"}]');
        break;
    case "getStatic":
		sendStatic($_SESSION["ip"],$_SESSION["username"],session::get("reputation"),"136","Reputation","Ranking");
        break;
	case "getPwdInfo":
		sendJSON('[{"title":"Change password","text":"You can reset your password now <b>for free!</b>","btn":"<input id=\"modal-submit\" type=\"submit\" class=\"btn btn-primary\" value=\"Change\"><a data-dismiss=\"modal\" class=\"btn\" href=\"#\">Cancel</a>","select2":""}]');
		break;
	case "loadHistory":
		sendJSON('[{"ip":"visited list!","time":"1500-05-22T03:46:39"},{"ip":"recently","time":"1900-05-22T04:37:52"},{"ip":"Testing","time":"2017-05-22T09:30:03"}]');
		break;
	case "gettext":
		if($_POST["id"] == "adb"){
			sendJSON('[{"title":"hilol","text":"k","btn":""}]');
		} elseif($_POST["id"] == "loadsoft"){
			sendJSON('[{"title":" ","text":" ","btn":" ","loading":"<div id=\"loading\"><img src=\"images/ajax-software.gif\"> Loading...</div>","placeholder":"Choose a software..."}]');
		}
		break;
	case "formatHD":
		sendJSON('[{"title":"Format Hard Drive","text":"Are you sure you want to format your hardrive ? This action cant be undone.","btn":"<input id=\"modal-submit\" type=\"submit\" class=\"btn btn-primary\" value=\"Yes\"><a data-dismiss=\"modal\" class=\"btn\" href=\"#\">Cancel</a>"}]');
		break;
	case "getFileActionsModal":
		if($_POST["type"]=="folder"){
		sendJSON('[{"title":"Create folder at localhost","text":"<div class=\"control-group\"><div class=\"controls\"><input class=\"name\" type=\"text\" name=\"name\" placeholder=\"Folder name\" style=\"width: 80%;\"/></div></div>","btn":"<input type=\"submit\" class=\"btn btn-primary\" value=\"Create folder\"><a data-dismiss=\"modal\" class=\"btn\" href=\"#\">Cancel</a>"}]');
		} elseif ($_POST["type"]=="text") {
		sendJSON('[{"title":"Create text file at localhost","text":"<div class=\"control-group\"><div class=\"input-prepend\"><div class=\"controls\"><input class=\"name\" type=\"text\" name=\"name\" placeholder=\"File name\" style=\"width: 67%;\"/><span class=\"add-on\" style=\"width: 10%;\">.txt</span></div></div></div><div class=\"control-group\"><div class=\"controls\"><textarea id=\"wysiwyg\" class=\"text\" name=\"text\" rows=\"5\" placeholder=\"Content\" style=\"width: 80%;\"></textarea><br/><span class=\"small pull-left link text-show-editor\" style=\"margin-left: 9%;\">Show editor</span></div></div>","btn":"<input type=\"submit\" class=\"btn btn-primary\" value=\"Create text file\"><a data-dismiss=\"modal\" class=\"btn\" href=\"#\">Cancel</a>"}]');
		}
		break;
	case "completeProcess":

		break;
	case "check-user":
		echo account::check_username(input::post("username"));
		break;
	case "check-mail":
		echo account::check_email(input::post("email"));
		break;
	case "loadSoftware":
		sendJSON(software::loadJSONData(account::getServerID()));
		break;
	case "reportBug":
	        sendJSON('[{"title":"<center>Report a bug</center>","text":"<center><div class=\"control-group\"><div class=\"controls\"><textarea id=\"bug-content\" class=\"bugtext\" name=\"bugcontent\" rows=\"5\" placeholder=\"Please explain in details what happened. In which page were you? Which action were you doing? Is it possible to reproduce the bug? Thanks!\" style=\"width: 80%;\"></textarea><br/><span class=\"small pull-left link\" style=\"margin-left: 9%;\"><label name=\"contact\">Contact me with bug information: <input id=\"bug-follow\" style=\"margin-left: 5px;\" type=\"checkbox\" name=\"contact\" value=\"1\" CHECKED></label></span></div></div></center>","btn":"<input id=\"bug-submit\" type=\"submit\" class=\"btn btn-info\" value=\"Report\">"}]');  
                break;
	case "getPartModal":
		$money = account::getMoney();
        $price = $_POST["opts"]["price"];
		$part_str = strtoupper($_POST["opts"]["part"]);

		if($money > $price){
			sendJSON('[{"title":"Upgrade '. $part_str .'","text":"Are you sure you want to buy '. $part_str .' for <span class=\"red\"><strong>$'. number_format($price) .'</strong></span>?<br/><br/><input type=\"hidden\" id=\"accSelect\" value=\"\"><span id=\"desc-money\"></span>","btn":"<input id=\"modal-submit\" type=\"submit\" class=\"btn btn-primary\" value=\"Buy\"><a data-dismiss=\"modal\" class=\"btn\" href=\"#\">Cancel</a>"}]');
		} else {
			sendJSON('[{"title":"Upgrade '. $part_str .'","text":"Are you sure you want to buy '. $part_str .' for <span class=\"red\"><strong>$'. number_format($price) .'</strong></span>?<br/><br/>You do not have enough money.","btn":"<a data-dismiss=\"modal\" class=\"btn\" href=\"#\">Cancel</a>"}]');
		}
		break;
	case "getBankAccs":
		sendJSON(bank::loadJSON());
		break;
	case "tempHolder":
		sendJSON("error");
		break;
    default:
		sendJSON("error");
}
?>


<?php
function sendStatic($ip, $user, $rep, $rank, $rep_title, $rank_title){
	sendJSON('[{"ip":"'. $ip .'","user":"'. $user .'","reputation":"'. $rep .'","rank":"'. $rank .'","rep_title":"'. $rep_title .'","rank_title":"'. $rank_title .'"}]');
}

function sendJSON($data){
header('Content-type: application/json');

if($data == "error"){
$obj = (object) array('status' => 'ERROR', 'redirect' => '', 'msg' => 'STOP SPYING ON ME!');
} else {
$obj = (object) array('status' => 'OK', 'redirect' => '', 'msg' => $data);
}


echo json_encode($obj);	
}
?>
