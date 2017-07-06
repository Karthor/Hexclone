<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

setCodeBody('<div id="content">');
setCodeBody(content_header('Log File'));
setCodeBody(breadcrumb("Home"));
setCodeBody('<div class="container-fluid">');
setCodeBody('<div class="row-fluid">');
setCodeBody('<div class="span12">');
setCodeBody('</div></div></div>');
printHeader();
printBody("ranking r-user");
printFooter();


