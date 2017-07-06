<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

    if($_GET){
	if($_GET["pid"] && $_GET["del"]){
            processes::delete(account::getUserID(), $_GET["pid"]);
            header('Location: processes');
	}
	
	if($_GET["pid"] && $_GET["action"] == "pause"){
            session::setAlert("The pause function is disabled for now. Coming back soon !","error");
	}
	
	if($_REQUEST["pid"]) {
            processes::isComplete($_REQUEST["pid"]);
	}
}

setCodeBody('<div id="content">');
setCodeBody(content_header('Task manager'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody(session::getAlert());
setCodeBody('<div class="widget-box">');
setCodeBody(nav_bar());

if($proc = processes::loadAll(account::getUserID())){
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody('<ul class="list">');
	if(!$_GET["pid"]){
		displayAllProcesses(session::get("uid"), $tasks);	
	} else {
		displayProcess(session::get("uid"), $_GET["pid"]);
	}
setCodeBody('</div></ul>');
} else {
session::set("tasks", 0);
processes::setAmount(account::getUserID(), 0);
setCodeBody(no_processes());
}
setCodeBody('<div style="clear: both;" class="nav nav-tabs"></div></div></div></div>');

printHeader();
printBody("processes");
printFooter();


