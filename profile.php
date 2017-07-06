<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

//processes::create(8, '', "formatHD", 1, "software", '', "localhost");
//session::setAlert("test","error");
//hardware::UpdateCollect(account::getUserID());
//print_r(processes::isWorking("93bcdb697fcbfe7d49dba744cc19f520"));
setCodeBody('<div id="content">');
setCodeBody(content_header('Profle 1337'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12">');
setCodeBody('</div></div></div>');
printHeader();
printBody("profile view");
printFooter();


