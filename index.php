<?php
require_once('autoload.php');

if(!session::get("logged") == 1){
include("framework/login.php");
} else {

$data = server::loadByIP(account::getIP());
setCodeBody('<div id="content">');
setCodeBody(content_header("Control Panel"));   
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody(session::getAlert());
setCodeBody('<div class="widget-box">');
setCodeBody(top_bar());
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody('<div class="span5">');
setCodeBody(hardware_info());
setCodeBody('</div><div class="span7">');
setCodeBody(general_info());
setCodeBody('</div><div class="row-fluid">');
setCodeBody('<div class="span7">');
setCodeBody(news_box());
setCodeBody('<div class="row-fluid"><div class="span6">');
setCodeBody(wanted_list());
setCodeBody('</div><div class="span6">');
setCodeBody(round_info($config["round_number"], $config["round_name"], $config["started"]));
setCodeBody('</div></div></div>');
setCodeBody('<div class="span5">');
setCodeBody(top_users_box());
setCodeBody('</div></div></div>');
setCodeBody('<div style="clear: both;" class="nav nav-tabs"></div>');
setCodeBody("<script>var indexdata={ip:'". account::getIP() ."',pass:'". $data["pass"] ."',up:'1 day and 16 hours',chg:'change'};</script>");
setCodeBody('<span id="modal"></span>');
setCodeBody('</div></div></div>');

printHeader();
printBody("index");
printFooter();
}


