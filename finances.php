<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

$data = bank::getAccount();
setCodeBody('<div id="content">');
setCodeBody(content_header('Finances'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12 center" style="text-align: center;">');
setCodeBody('<div class="widget-box">');
setCodeBody(widget_title());
setCodeBody('<div class="widget-content padding noborder">');
setCodeBody(fiance_box(bank::totalWorth()));
if(sizeof($data) == 1){
addAccountBox($data,1);	
}elseif(sizeof($data) == 2){
addAccountBox($data,2);	
}elseif(sizeof($data) == 3){
addAccountBox($data,3);	
}elseif(sizeof($data) == 4){
addAccountBox($data,2);	
addAccountBox($data,2);	
}elseif(sizeof($data) == 5){
addAccountBox($data,2);	
addAccountBox($data,2);	
addAccountBox($data,1);	
}
setCodeBody('</div');
setCodeBody('<div style="clear: both;" class="nav nav-tabs">&nbsp;</div></div></div></div></div>');
setCodeBody('<div class="center" style="margin-bottom: 20px;">');
//Print HTML
printHeader();
printBody("finances");
printFooter();

if($_SESSION["logged"] != 1){
redirect::go("index");
}