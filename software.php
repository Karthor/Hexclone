<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

$ID = $_GET['id'];
$data = software::getSoftwareData($ID);
$text = ' file <b>'. $data["fullname"] . '</b>('. number_format($data["version"],1) .') at <a href="software">localhost</a>';
$av = ' <b>'. $data["fullname"] . '</b>('. number_format($data["version"],1) .') at <a href="software">localhost</a>';

switch (input::get("action")) {
    case 'install':
        if($data["special"] == "virus"){ session::setAlert("CANT_INSTALL_VIRUS_YOURSELF", "error"); redirect::go("software"); }
        if($data["hidden"] != 0){ session::setAlert("You can't install hidden softwares!", "error"); redirect::go("software"); }
        
        if($pid = processes::isWorking($data["checksum"])) //Check if the process is alredy working!
        { 

        } else {
            processes::setRedirect(1);
            if($data["special"] == "av"){
                $pid = processes::create(8, "Run Antivirus" . $av, "runAV", $ID, "software", $data["checksum"], "localhost");
            } elseif($data["special"] == "vcol") {
                redirect::go("list?action=collect");
            } else {
                $pid = processes::create(8, "Install" . $text, "installFile", $ID, "software", $data["checksum"], "localhost"); 
            }
            
        }

        $progressBar = 1;
    break;
    case 'uninstall':
        processes::create(8, "Uninstall" .$text, "uninstallFile", $ID, "software", '', "localhost");
    break;
    case 'del':
        if($data["hidden"] != 0){ session::setAlert("You can't remove hidden softwares!", "error"); redirect::go("software"); }
        processes::create(8, "Delete" .$text, "deleteFile", $ID, "software", '', "localhost");
    break;

    case 'hide':
    $hidder = software::getTargetSoftware(account::getServerID(), "Hidder");
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Hide file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1) . ") at localhost";
    processes::create(7,$procText, "hideFile", $_GET["id"], "software", $hidder, "localhost");
        if(!$hidder){
            session::setAlert("You don't have a hidder software.", "error");
            redirect::go("software");
        }
    break;
    
    case 'seek':
    $seeker = software::getTargetSoftware(account::getServerID(), "Seeker");
    $data = software::getSoftwareData($_GET["id"]);
    $procText = "Seek file <b>" . $data["fullname"] . "</b>(" . number_format($data["version"],1)  . ") at localhost";
    processes::create(7,$procText, "seekFile", $_GET["id"], "software", $data["checksum"], "localhost");
        if(!$seeker){
            session::setAlert("You don't have any seeker.", "error");
            redirect::go("software");
        }
    break;
}

switch (input::post("act")) {
    case 'hd-format':
        processes::create(8, '', "formatHD", 1, "software", '', "localhost"); //Should redirect to clan.php
    break;

    case 'create-text':
        $data = input::post("text");
        software::createFile(input::post("name"), ".txt", account::getServerID(), $data);
        session::setAlert("Text file created.", "success");
    break;
}

setCodeBody('<div id="content">');
setCodeBody(content_header('Software'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12">');
setCodeBody(session::getAlert());
setCodeBody('<div class="widget-box">');

if($_GET["page"] == "external"){
setCodeBody(navTab("external"));
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody('<div class="span9">');
setCodeBody('<p>You do not have any software on your external HD. Use the sidebar to upload.</p>');
setCodeBody(external_bar());
setCodeBody('</div>');
setCodeBody('</div>');
} elseif(!$progressBar) {
setCodeBody(navTab("software"));
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody('<div class="span9">');
setCodeBody(showFiles(account::getServerID()));
setCodeBody('</div>');
setCodeBody('</div>');
setCodeBody(software_bar());  
}


if($progressBar){
loadJS("jquery.ui.custom");
setCodeBody(navTab("software"));
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody('<div class="span9">');
displayProcess(account::getUserID(),$pid);
setCodeBody('</div>');
setCodeBody('</div>');
}


setCodeBody('<div style="clear: both;" class="nav nav-tabs">&nbsp;</div>');
setCodeBody('</div>');
setCodeBody('</div>');
setCodeBody('</div>');
setCodeBody('</div>');
setCodeBody('<div class="center" style="margin-bottom: 20px;"></div>');

printHeader();
printBody("software file-actions pie");
printFooter();
