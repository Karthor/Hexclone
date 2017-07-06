<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

$data = account::getMail();

if($_POST["act"] == "delete"){
    $id = input::post("id");
    
    database::setTable("mail");
    database::delete("ID", $id);
    session::setAlert("E-mail deleted.", "success");
    redirect::go("mail");
}
setCodeBody('<div id="content">');
setCodeBody(content_header('E-mail'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12">');
setCodeBody(session::getAlert());
setCodeBody('<div class="widget-box">');
setCodeBody(Tabs());
setCodeBody('<div class="widget-content padding noborder">');
if($_GET["id"]){
database::setTable("mail");
database::update("ID", $_GET["id"], "seen", 1);
$emailData = database::select("ID", $_GET["id"]);
setCodeBody('<div class="span8">');
setCodeBody(Box($emailData["message"], $emailData["fromID"], $emailData["sent"], $emailData["title"]));
setCodeBody(replyArea($emailData["title"], $emailData["fromID"], $emailData["ID"]));
setCodeBody('<script>document.getElementById("mail-title").innerHTML="'. $emailData["title"] .'";</script>');
setCodeBody('</div>');
setCodeBody(infoBox($emailData["fromID"]));
setCodeBody('</div>');
} else {

    if($data){
            
            setCodeBody('<div class="widget-box">');
            setCodeBody(InboxBar(sizeof($data)));
            setCodeBody('<div class="widget-content nopadding">');
            setCodeBody('<table class="table table-cozy table-bordered table-striped table-hover">');
            setCodeBody(mailHead());
            setCodeBody('<tbody>');
            for ($x = 0; $x < sizeof($data); $x++){
            $emailData = $data[$x];
            database::setTable("account");
            $userID = database::select("username", $emailData["fromID"]);

            if($userID){ //An player sent it
                    $from = '<a href="profile?id='. $userID["UID"] .'">'. $emailData["fromID"] .'</a>';
            } else { //NPC Sent the email or deleted player!
                    $from = $emailData["fromID"];
            }

            setCodeBody(printMail($emailData["sent"], $emailData["title"], $from, $emailData["ID"], $emailData["seen"]));
            }
            setCodeBody('</tbody>');
            setCodeBody('</table>');
            setCodeBody('</div>');
            setCodeBody('<span id="modal"></span>');
            setCodeBody('</div><br/></div>');
    } else {
    setCodeBody('You have no mails</div>');

    }
}
setCodeBody('<div style="clear: both;" class="nav nav-tabs"></div>');
setCodeBody('</div></div></div></div>');
setCodeBody('<div class="center" style="margin-bottom: 20px;">');
printHeader();
printBody("mail");
printFooter();






