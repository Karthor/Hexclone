<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

$server_num = session::get("servers_num");
$page = input::get("opt");
$shops = parse_ini_file("config/shops.ini", true);

if($page == "buy"){
    $lastCol = TimeDiffCol(hardware::getLastCollected(account::getUserID()));
    $timeDuration = 300;
    
    if($lastCol >= 300){
        hardware::UpdateCollect(account::getUserID());
        hardware::buyServer(account::getUserID());
        session::set("servers",hardware::loadData(account::getUserID()));
        session::set("servers_num", sizeof(account::getHardwareData()));
        session::setAlert("Your hardware was upgraded.", "success", "hardware");
        redirect::go("hardware");  
    } else {
        session::setAlert("You'll have to wait ". displayTime($lastCol) . " until you can get another free server!", "error");
	redirect::go("hardware");  
    }
            

}

if($page == "internet" && $_POST["acc"]){
    $buyNetID = input::post("part-id");
    $netID = hardware::loadNetID(account::getServerID());
    
    if($netID < $buyNetID){
        if(bank::canIAfford(input::post("price"), input::post("acc"))){
            bank::pay(input::post("acc"),input::post("price"));
            hardware::upgradeNet($buyNetID);
            session::set("netID", hardware::LoadNetID(account::getServerID()));
            session::setAlert("Your hardware was upgraded.", "success");
            redirect::go("hardware");
        } 
    }
}

if($page == "upgrade" && $_POST["acc"] && $_GET["id"]){
    $hID = input::get("id");
    $partID = input::post("part-id");
    $part = input::post("act");
    
    if(bank::canIAfford(input::post("price"), input::post("acc"))){
        if(buyUpgrade($part, $partID, $hID)){
            bank::pay(input::post("acc"),input::post("price"));
            $hID = input::get("id");
            $partID = input::post("part-id");
            $part = input::post("act");
            session::set("servers",hardware::loadData(account::getUserID()));
            session::setAlert("Your hardware was upgraded.", "success");
            redirect::go("hardware"); 
        }
    }
}
    


setCodeBody('<div id="content">');
setCodeBody(content_header('Hardware'));
setCodeBody(breadcrumb());
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12" style="text-align: center;">');
setCodeBody(session::getAlert());
setCodeBody('<div class="widget-box">');
setCodeBody(tabs($page));
setCodeBody('<div class="widget-content padding noborder">');
if($page == "upgrade"){
setCodeBody('<div class="span8">');
for ($x = 0; $x < sizeof($shops); $x++){
    setCodeBody(printShop($shops[$x]["name"], $shops[$x]["title"]));
}
setCodeBody('<span id="modal"></span>');
setCodeBody('</div>');
setCodeBody(showServerList());
setCodeBody(changeNameButton());
setCodeBody('</div>');
} elseif($page == "buy") {

} elseif($page == "internet") {
setCodeBody('<div class="span8">');
setCodeBody(showUpgradeNET());
setCodeBody('<span id="modal"></span>');
setCodeBody('</div>');
setCodeBody(showServerList());
setCodeBody('</div>');
} elseif($page == "xhd") {

} else {
    setCodeBody(totalBox());
    if($server_num < 6){ //less than 6 servers

    if($server_num == 1){
    addServerBox(1, session::get("servers"));	
    }elseif($server_num == 2){
    addServerBox(2, session::get("servers"));	
    }elseif($server_num == 3){
    addServerBox(3, session::get("servers"));	
    }elseif($server_num == 4){
    addServerBox(2, session::get("servers"));	
    addServerBox(2, session::get("servers"));	
    }elseif($server_num == 5){
    addServerBox(2, session::get("servers"));	
    addServerBox(2, session::get("servers"));	
    addServerBox(1, session::get("servers"));	
    }
    } else { //6 servers or more
    $last_row = $server_num % 3;
    $loops = $server_num / 3;
    if($loops >= 10){
    $loops = substr($loops,0,2);	
    } else {
    $loops = substr($loops,0,1);
    }


    for ($x = 0; $x < $loops; $x++) {
    addServerBox(3, session::get("servers"));	
    }

    if(!$last_row == 0){
    addServerBox($last_row, session::get("servers"));	
    }

    }
}
setCodeBody('</div><div style="clear: both;" class="nav nav-tabs">&nbsp;</div></div></div></div></div>');

printHeader();
printBody("hardware");
printFooter();