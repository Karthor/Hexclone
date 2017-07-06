<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

session::set("ip",server::getIP(account::getServerID()));

if(!internet::getIP()){
    internet::setIP('1.2.3.4');
}

if(input::get("ip")){
    if(!internet::isIP(input::get("ip"))) { //Invaild IP
        internet::setIP(internet::getIP());
        session::setAlert("The IP address <strong>". input::get("ip") ."</strong> is invalid.", "error");
        redirect::go("internet.php");
    }
    
    if(internet::getStatus() == "offline"){
       session::setArray("internet", "ip", input::get("ip")); 
    } elseif(internet::getStatus() == "online") {
       session::setAlert('You are currently logged to <strong><a href="internet?ip='. internet::getIP() .'">'. internet::getIP() .'</a></strong>.Would you like to <a href="internet?view=logout&amp;redirect='. input::get("ip") .'">log out</a>?', "warning");
    }
}

if(internet::getIP()){ //Check if IP is intitalized
    $ip = internet::getIP();
} else {
    $ip = "1.2.3.4";    
}

/* Misc */

if($_GET["action"]=="login" && $_GET["user"]){
    if(internet::getStatus() == "online"){
        session::setAlert("You need to logout first!", "error");
    } else {
      loginServer($_GET["user"],$_GET["pass"], internet::getIP());  
    }   
}

if($_GET["action"]=="hack" && $_GET["method"] == "bf"){
    Bruteforce(internet::getIP());
}

if($_GET["action"]=="hack"){
    if(internet::isHacked(internet::getIP(), account::getUserID())){
        session::setAlert("This IP is already on your hacked database.","error");
        redirect::go("internet?action=login");
    } 
}

if($_GET["view"]=="logout"){
    if($_GET["redirect"]){
    internet::logout();
    redirect::go("internet?ip=" . input::get("redirect"));
    }
    
    internet::logout();
    redirect::go("internet");
}

if($_GET["action"]=="register" && $_POST["int-act"] == "register"){
    Bank::createAccount(internet::getIP());
}

/* Softwares */

switch ($_POST['act']) {
    case 'create-text':
        $data = input::post("text");
        //$id = input::post("id");
        software::createFile(input::post("name"), ".txt", internet::getServerID(), $data);
        session::setAlert("Text file created.", "success");
    break;
}

/* Seek Software */
if($_GET["action"] == "seek"){
    $seeker = software::getTargetSoftware(account::getServerID(), "Seeker");
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Seek file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    processes::create(7,$procText, "seekFile", $_GET["id"], "internet?view=software", $data["checksum"]);
    if(!$seeker){
        session::setAlert("You don't have any seeker.", "error");
        redirect::go("internet?view=software");
    }
}

/* Hide Software */
if($_GET["action"] == "hide"){
    $hidder = software::getTargetSoftware(account::getServerID(), "Hidder");
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Hide file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    processes::create(7,$procText, "hideFile", $_GET["id"], "internet?view=software", $hidder);
    if(!$hidder){
        session::setAlert("You don't have a hidder software.", "error");
        redirect::go("internet?view=software");
    }
}

/* Uninstall Software */
if($_GET["action"]=="uninstall" && $_GET["id"]){
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Uninstall file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    processes::create(7,$procText, "uninstallFile", $_GET["id"], "internet?view=software", $data["checksum"]);
}

/* Install Software */
if($_GET["action"]=="install" && $_GET["id"]){
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Install file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    
    if($data["special"] == "av"){
        processes::create(7,"Run Antivirus " . "<b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at " . internet::getIP(), "runAV", $_GET["id"], "internet?view=software", $data["checksum"]);
    } elseif($data["special"] == "vcol") {
        /* VCOL RUN ROUTINE */
    } elseif($data["hidden"] != 0) {
        session::setAlert("You can't run hidden softwares!", "error");
    } else {
        processes::create(7,$procText, "installFile", $_GET["id"], "internet?view=software", $data["checksum"]); 
    }
    
    
}

/* Delete Software */
if($_GET["action"]=="del" && $_GET["id"]){
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Delete file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    
    if($data["hidden"] == 0){
        processes::create(7,$procText, "deleteFile", $_GET["id"], "internet?view=software", $data["checksum"]);  
    } else {
        session::setAlert("You can't remove hidden softwares!", "error");
    }
    
    
}

/* Upload Software */
if($_GET["view"]=="software" && $_GET["cmd"]=="up" && $_GET["id"]){
    $data = software::getSoftwareData($_GET["id"]);
    
    if($data["hidden"] != 0){
        session::setAlert("You can't upload hidden softwares!", "error");
        redirect::go("internet?view=software");
    }
    
    if($pid = processes::isWorking($data["checksum"])) //Check if the process is alredy working!
    { 
        redirect::go("processes?pid=" . $pid);
    }
    
    if(software::checkExists($data["checksum"], internet::getServerID())){
        session::setAlert("The remote client already have this software.", "error");
        redirect::go("internet?view=software");
    }
    
    $procText = "Upload file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    processes::create(calculateDownloadTime($data["size"]),$procText, "uploadFile", $_GET["id"], "internet?view=software", $data["checksum"]);
}

/* Download Software */
if($_GET["view"]=="software" && $_GET["cmd"]=="dl" && $_GET["id"]){
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Download file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at "  . internet::getIP();
    
    if($data["hidden"] != 0){
        session::setAlert("You can't download hidden softwares!", "error");
        redirect::go("internet?view=software");
    }
    
    if($pid = processes::isWorking($data["checksum"])) //Check if the process is alredy working!
    { 
        redirect::go("processes?pid=" . $pid);
    }

    if(checkOK($_GET["id"])){ //Check if the file is too big or if the user alredy have it!
    processes::create(calculateDownloadTime($data["size"]),$procText, "downloadFile", $_GET["id"], "internet?view=software", $data["checksum"]);
    }
}

/* HTML Code */

setCodeBody('<div id="content">');
setCodeBody(content_header('Internet'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span9">');
setCodeBody(browser_input($ip));
setCodeBody(session::getAlert());

if(session::getArray("internet", "status") == "online"){
        setCodeBody('</div>');                          //Online
        setCodeBody('<div class="widget-box">');
        setCodeBody(navTabs_online($_GET["view"]));
        setCodeBody('<div class="widget-content padding noborder">');
    if($_GET["view"]=="software"){
        session::setArray("internet","tab", 'software');
        setCodeBody('<div class="span12">');
        setCodeBody(showFiles($ip));
        setCodeBody(software_bar());
        setCodeBody('</div><div class="nav nav-tabs" style="clear: both;"></div></div></div></div>');
    } elseif($_GET["view"] == "logs" || session::getArray("internet", "status") == "online"){
        session::setArray("internet","tab", 'logs');
        setCodeBody('<div class="span12">');
        setCodeBody('<div class="span12">');
        setCodeBody('<div class="span2 center"></div>');
        setCodeBody(serverLog(log::getLog(session::getArray("internet", "ip"))));
        setCodeBody('</div></div></div><div class="nav nav-tabs" style="clear: both;"></div></div></div></div>');
    }
} else { 
     setCodeBody('<div class="widget-box">');          //Offline
    if(!$_GET["action"]){
        if($data = server::loadByIP($ip)){
            setCodeBody(Tabs("index", $ip,0));
            setCodeBody('<div class="widget-content padding noborder">');
                if(internet::getIP() == "160.7.191.179"){
                    setCodeBody(showBitcon(1));
                    loadCodeJS('<script type="text/javascript">function start(method){if(window.$){$.getScript("js/npc.js",function(){bitcoin();})}else{setTimeout(function(){start(method);},50);}}start();</script>');
                } else {
                    setCodeBody(display_internet($data));
                }
            session::set("last_ip",$ip);
        } else {
            setCodeBody('<div class="widget-content padding noborder">');
            setCodeBody(not_found());
            internet::setIP("1.2.3.4");
        }
        setCodeBody('</div><div style="clear: both;" class="nav nav-tabs">&nbsp;</div></div></div><div class="span3">');
        setCodeBody(recently_visited());
        setCodeBody(important());
        setCodeBody('</div>');
        setCodeBody('</div></div>');
    } elseif($_GET["action"] == "hack"){
        setCodeBody(Tabs("hack", $ip));
        setCodeBody('<div class="widget-content padding noborder">');
        setCodeBody(printHack());
        setCodeBody('</div><div style="clear: both;" class="nav nav-tabs">&nbsp;</div></div></div><div class="span3">');
        setCodeBody(recently_visited());
        setCodeBody(important());
        setCodeBody('</div>');
        setCodeBody('</div></div>');
    } elseif($_GET["action"] == "login"){
        loadCSS("he_login");
        setCodeBody(Tabs("login", $ip));
        setCodeBody('<div class="widget-content padding noborder">');	
        setCodeBody('</div>');
        if($data = internet::isHacked($ip, account::getUserID())){
            
            if($data["pass"] == "download"){
                setCodeBody(printLogin("download",$data["pass"]));  
            } else {
                setCodeBody(printLogin("root",$data["pass"]));       
            }
            
        } else {
            setCodeBody(printLogin("",""));	
        }
        setCodeBody('<div style="clear: both;" class="nav nav-tabs">&nbsp;</div></div><div class="center" style="margin-bottom: 20px;"></div></div><div class="span3">');
        setCodeBody(recently_visited());
        setCodeBody(important());
        setCodeBody('</div>');
        setCodeBody('</div></div>');
    } elseif($_GET["action"] == "register"){
        setCodeBody(Tabs("bank_register", $ip));
        setCodeBody('<div class="widget-content padding noborder">');
        setCodeBody('<form action="" method="POST">Creating an account here is free!</br><br/><input type="hidden" name="int-act" value="register"><input type="submit" value="Create account"></form>');
        setCodeBody('</div>');	
        setCodeBody('<div class="nav nav-tabs"></div></div></div></div>');
    }
}

printHeader();
printBody("internet history upload file-actions pie");
printFooter();

