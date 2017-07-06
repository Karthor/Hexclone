<?php
include('autoload.php');

if($_SESSION["logged"] != 1){
sendJSON("error");
exit();
}

$btcWorth = getBTCValue();
$btcTotal = "1.0000000";

switch ($_POST["func"]) {

	case "btcBuy":
		sendJSON('[{"title":"Buy bitcoins","text":"<div class=\"control-group\"><div class=\"controls\"><input id=\"btc-amount\" class=\"name\" type=\"text\" name=\"btc-amount\" placeholder=\"BTC Amount\" style=\"width: 80%;\" value=\"1.0\"/></div><div class=\"controls\"><span class=\"pull-left\" style=\"margin-left: 9%;\"><span class=\"item\">Rate: </span>1 BTC = $'. $btcWorth .'</span></div><br/><div class=\"controls\"><span class=\"pull-left\" style=\"margin-left: 9%;\"><span class=\"item\">Value: </span><span class=\"green\">$<span id=\"btc-total\"></span></span></span></div></div><br/><div id=\"loading\" class=\"pull-left\" style=\"margin-left: 9%;\"><img src=\"images/ajax-money.gif\">Loading...</div><input type=\"hidden\" id=\"accSelect\" value=\"\"><span id=\"desc-money\" class=\"pull-left\" style=\"margin-left: 9%;\"></span>","value":"'. $btcWorth .'"}]');
	break;
	
	case "btcSell":
		
		sendJSON('[{"title":"Sell bitcoins","text":"<div class=\"control-group\"><div class=\"controls\"><input id=\"btc-amount\" class=\"name\" type=\"text\" name=\"btc-amount\" placeholder=\"BTC Amount\" style=\"width: 80%;\" value=\"'. $btcTotal .'\"/></div><div class=\"controls\"><span class=\"pull-left\" style=\"margin-left: 9%;\"><span class=\"item\">Rate: </span>1 BTC = $'. $btcWorth .'</span></div><br/><div class=\"controls\"><span class=\"pull-left\" style=\"margin-left: 9%;\"><span class=\"item\">Value: </span><span class=\"green\">$<span id=\"btc-total\"></span></span></span></div></div><br/><div id=\"loading\" class=\"pull-left\" style=\"margin-left: 9%;\"><img src=\"images/ajax-money.gif\">Loading...</div><input type=\"hidden\" id=\"accSelect\" value=\"\"><span id=\"desc-money\" class=\"pull-left\" style=\"margin-left: 9%;\"></span>","value":"'. $btcWorth .'","amount":"'. $btcTotal .'"}]');
	break;
	
	case "btcTransfer":
		sendJSON('[{"title":"Transfer bitcoins","text":"<div class=\"control-group\"><div class=\"controls\">From <span class=\"item\">BTCADDR</span></div><br/><div class=\"controls\"><input id=\"btc-amount\" class=\"name\" type=\"text\" name=\"btc-amount\" placeholder=\"BTC Amount\" style=\"width: 80%;\" value=\"'. $btcTotal .'\"/></div></div><div class=\"control-group\"><div class=\"controls\"><input id=\"btc-to\" class=\"name\" type=\"text\" name=\"btc-to\" placeholder=\"Destination address\" style=\"width: 80%;\"/></div></div>","value":"'. $btcWorth .'"}]');
	break;
	
	case "btcLogin":
		$addr = input::post("addr");
		$key = input::post("key");
		
		
	break;
	
	default:
		sendJSON("error");
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