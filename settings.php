<?php
require_once('autoload.php');

if($_SESSION["logged"] != 1){
redirect::go("index");
}

setCodeBody('<div id="content">');
setCodeBody(content_header('Log File'));
setCodeBody(breadcrumb("Home"));

$html = <<<HTML
<div class="container-fluid">
<div class="row-fluid">
<div class="span12">
<div class="widget-box">
<div class="widget-title">
<ul class="nav nav-tabs">
<li class="link active"><a href="settings.php"><span class="icon-tab he16-settings"></span>My settings</a></li>
<a href="#"><span class="label label-info">Help</span></a>
</ul>
</div>
<div class="widget-content padding noborder">
<div class="span6">
<div class="widget-box">
<div class="widget-title">
<span class="icon"><span class="he16-chg_lang"></span></span>
<h5>Change language</h5>
</div>
<div class="widget-content nopadding">
<form action="" method="POST" class="form-horizontal">
<div class="control-group">
<div class="controls">
<select id="select-lang" name="lang" placeholder="Choose new language" style="width: 300px;">
<option></option>
<option name="en">English</option>
<option name="pt">Português</option>
</select>
</div>
</div>
<div class="form-actions">
<button type="submit" class="btn btn-primary">Change</button>
</div>
</form>
<div style="clear: both;"></div>
</div>
</div>
<div class="widget-box">
<div class="widget-title">
<span class="icon"><span class="he16-change_pwd"></span></span>
<h5>Change password</h5>
</div>
<div class="widget-content nopadding">
<form action="" method="POST" class="form-horizontal">
<div class="control-group">
<label class="control-label">Current password</label>
<div class="controls">
<input name="old" type="password"/>
</div>
</div>
<div class="control-group">
<label class="control-label">New password</label>
<div class="controls">
<input name="new1" type="password"/>
</div>
</div>
<div class="control-group">
<label class="control-label">Confirm new password</label>
<div class="controls">
<input name="new2" type="password"/>
</div>
</div>
<div class="form-actions">
<button type="submit" class="btn btn-primary">Change</button>
</div>
</form>
</div>
</div>
<div class="widget-box">
<div class="widget-title">
<span class="icon"><span class="he16-del_acc"></span></span>
<h5>Delete account</h5>
</div>
<div class="widget-content nopadding">
<form action="delete" method="POST" class="form-horizontal">
<div class="form-actions">
<button type="submit" class="btn btn-danger">Delete account!</button> &nbsp;A verification e-mail will be sent to you. </div>
</form>
</div>
</div>
</div>
<div class="span6">
<div class="widget-box">
<div class="widget-title">
<span class="icon"><span class="he16-premium"></span></span>
<h5>Buy premium account</h5>
</div>
<div class="widget-content">
Hey oh! Let's make this real fun. Refeer to the <a href="premium">premium page</a> in order to get detailed information about premium accounts. <br/>
*Licks from Phoebe*<br/><br/>
<div class="center">
<img src="images/500xNxphoebe2.jpg.pagespeed.ic.r9f33bnoTM.webp" width="500">
</div>
</div>
</div>
</div>
</div>
<div class="nav nav-tabs" style="clear: both;"></div>
</div>
</div>
</div>
</div>
HTML;

setCodeBody($html);
printHeader();
printBody("settings");
printFooter();


