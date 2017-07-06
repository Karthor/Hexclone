<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

$bodyClass = "hackeddb";
$data = internet::getHackedList(account::getUserID());

$page = input::get("action") ? $page = input::get("action") : $page = input::get("show");

if(input::get("action") == "collect" && input::get("show") == "last"){
    
}

if(input::post("act") == "deleteip"){
    $id = input::post("id");
    database::setTable("hackedlist");
    database::delete("id", $id);
    session::setAlert("IP removed from list.", "success");
    redirect::go("list");
}

if(input::post("act") == "collect" && input::post("acc")){
    if(!software::getTargetSoftware(account::getServerID(), "Virus collector",0)){
        session::setAlert("no vcol!.", "error");     
        redirect::go("list?action=collect");
    }
    
    
    database::setTable("active_virus");
    $virus_data = database::selectMulti("ownerID", account::getUserID());
    //Array ( [0] => Array ( [ID] => 22 [virusID] => 10374 [started] => 2017-06-12 01:01:58 [collected] => 2017-06-12 01:01:58 [serverID] => 46 [ownerID] => 10010 [version] => 11 ) )
    
    for ($x = 0; $x < sizeof($virus_data); $x++){
        $timeCol = strtotime($virus_data[$x]["collected"]);
        $timeElapsedMinutes = (time() - $timeCol)/60;
        $virusID = $virus_data[$x]["virusID"];
            
        if((int)$timeElapsedMinutes >= 10){
            $cvirus++;
            switch ($virus_data[$x]["type"]) {
                case "spam":
                    $bonus = software::getTargetSoftware(account::getServerID(), "Virus collector",0);
                    $money = calcSpam($timeElapsedMinutes, $virusdata[$x]["serverID"]);
                    $totalMoney = $money*(($bonus/100)+1);
                    bank::receive(input::post("acc"), $totalMoney);
                    database::setTable("active_virus");
                    database::updateToNOW("ID", $virus_data[$x]["ID"], "collected");
                    account::setLastCollectInfo($timeElapsedMinutes, $money, input::post("acc"), $bonus, server::getIP($virus_data[$x]["serverID"]));
                break;
            
                case "miner":
                    
                break;
            
                case "warez":
                    
                break;
            }
        }
    }
    if($cvirus >= 1){
       redirect::go("list?action=collect&show=last"); 
    }
    
    
    if($cvirus == 0 && $virus_data){
      session::setAlert("All servers were ignored because did not match minimum collect time.", "error"); 
    }

    if(!$virus_data){
        session::setAlert("You do not have any running virus.", "error");
    }
    
}

setCodeBody('<div id="content">');
setCodeBody(content_header('Log File'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12">');
setCodeBody(session::getAlert());
setCodeBody('<div class="widget-box">');
setCodeBody(Tabs($page));
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody('<div class="span12">');

if(!input::get("action")){
    setCodeBody('<ul class="list ip" id="list">'); 
    for ($x = 0; $x < sizeof($data); $x++){
        setCodeBody(addEntry($data[$x]["id"],$data[$x]["ip"],$data[$x]["pass"]));
    }
    setCodeBody('</ul>');
} elseif(input::get("action") == "collect" && !input::get("show")){
    $bodyClass = "hackeddb collect";
    setCodeBody(showCollect());
} elseif(input::get("action") == "collect" && input::get("show")){
    setCodeBody(showLastCollected());
} elseif(input::get("action") == "ddos"){
    setCodeBody(showDDos());
}

setCodeBody('<script>var virTime=new Array();</script><span id="modal"></span><br/></div></div>');    
setCodeBody('<div class="nav nav-tabs" style="clear: both;">&nbsp;</div> </div>');
setCodeBody('</div></div></div>');
setCodeBody('<div class="center" style="margin-bottom: 20px;">');
printHeader();
printBody($bodyClass);
printFooter();


